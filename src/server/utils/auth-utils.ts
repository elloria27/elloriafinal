
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/user';

// Інтерфейс для даних, які зберігаються в JWT токені
interface JwtPayload {
  sub: string; // Ідентифікатор користувача
  email: string;
  role: UserRole;
  iat?: number; // Час видачі
  exp?: number; // Час закінчення терміну дії
}

// Секретний ключ для підпису JWT токенів
// Це потрібно буде замінити на реальний секретний ключ з env змінних
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Термін дії токену (у секундах)
const TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 днів

// Генерація JWT токену для користувача
export const generateToken = (user: User, role: UserRole): string => {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY
  };

  return jwt.sign(payload, JWT_SECRET);
};

// Перевірка і декодування JWT токену
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Middleware для перевірки автентифікації
export const authMiddleware = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decodedToken = verifyToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Додаємо інформацію про користувача до об'єкту запиту
    req.user = {
      id: decodedToken.sub,
      email: decodedToken.email,
      role: decodedToken.role
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Middleware для перевірки ролі адміністратора
export const adminMiddleware = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};
