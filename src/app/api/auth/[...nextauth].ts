/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Replace this with your own logic to find the user
        const user = { id: 1, name: 'User', email: 'user@example.com' };
        if (user) return user;
        return null;
      },
    }),
  ],
  session: {
    jwt: true,
  },
  pages: {
    signIn: '/auth/signin',
  },
});
