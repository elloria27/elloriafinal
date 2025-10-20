-- Delete duplicate and old Stripe payment method entries
DELETE FROM payment_methods 
WHERE id IN (
  '575b7722-06b9-4a96-a197-cc40621ecef3',
  '1522251f-14a7-418c-91fb-cf21a16d25f7'
);