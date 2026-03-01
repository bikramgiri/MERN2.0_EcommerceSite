// src/types/passport.d.ts
declare module 'passport' {
  export function initialize(): any;
  export function session(): any;
  export function authenticate(strategy: string, options?: any): any;
  // Add more if needed
}