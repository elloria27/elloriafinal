
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const SUPABASE_URL = "";
export const SUPABASE_PUBLISHABLE_KEY = "";

// Create a dummy client when URL/key are not configured
const createSafeClient = () => {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const dummyQueryResponse = {
      data: null,
      error: null,
      count: null,
      status: 200,
      statusText: "OK",
    };

    const dummyQueryBuilder = {
      select: () => dummyQueryBuilder,
      insert: () => Promise.resolve(dummyQueryResponse),
      update: () => Promise.resolve(dummyQueryResponse),
      delete: () => Promise.resolve(dummyQueryResponse),
      upsert: () => Promise.resolve(dummyQueryResponse),
      match: () => dummyQueryBuilder,
      eq: () => dummyQueryBuilder,
      neq: () => dummyQueryBuilder,
      gt: () => dummyQueryBuilder,
      lt: () => dummyQueryBuilder,
      gte: () => dummyQueryBuilder,
      lte: () => dummyQueryBuilder,
      like: () => dummyQueryBuilder,
      ilike: () => dummyQueryBuilder,
      is: () => dummyQueryBuilder,
      in: () => dummyQueryBuilder,
      contains: () => dummyQueryBuilder,
      containedBy: () => dummyQueryBuilder,
      range: () => dummyQueryBuilder,
      textSearch: () => dummyQueryBuilder,
      filter: () => dummyQueryBuilder,
      order: () => dummyQueryBuilder,
      limit: () => dummyQueryBuilder,
      offset: () => dummyQueryBuilder,
      single: () => Promise.resolve(dummyQueryResponse),
      maybeSingle: () => Promise.resolve(dummyQueryResponse),
      then: (callback: any) => Promise.resolve(callback(dummyQueryResponse)),
      or: (filter: string) => dummyQueryBuilder,
    };

    const dummyAuthResponse = {
      data: { 
        session: null,
        user: null 
      },
      error: null
    };

    const dummyChannel = {
      subscribe: () => ({
        unsubscribe: () => {},
      }),
      on: () => dummyChannel,
      unsubscribe: () => {},
      // Add required RealtimeChannel properties
      topic: '',
      params: {},
      socket: {
        isConnected: () => false,
        connect: () => {},
        disconnect: () => {},
      },
      bindings: {},
      presence: {
        state: {},
        onJoin: () => {},
        onLeave: () => {},
      },
      rejoinTimer: {
        reset: () => {},
      },
    };

    return {
      from: () => dummyQueryBuilder,
      rpc: () => Promise.resolve(dummyQueryResponse),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: null }),
          download: () => Promise.resolve({ data: null, error: null }),
          list: () => Promise.resolve({ data: [], error: null }),
          remove: () => Promise.resolve({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve(dummyAuthResponse),
        signUp: () => Promise.resolve(dummyAuthResponse),
        signIn: () => Promise.resolve(dummyAuthResponse),
        signInWithPassword: () => Promise.resolve(dummyAuthResponse),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: (callback: any) => {
          // Return dummy subscription
          return {
            data: { subscription: { unsubscribe: () => {} } },
            error: null
          };
        },
        updateUser: () => Promise.resolve(dummyAuthResponse),
      },
      channel: (topic: string) => dummyChannel,
      removeChannel: () => Promise.resolve(),
      functions: {
        invoke: () => Promise.resolve({ data: null, error: null }),
      },
    };
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
};

export const supabase = createSafeClient();
