import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/app/models/user'; // Ensure the path to your User model is correct

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials;

        // Check user in your database
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
          return null; // Invalid credentials
        }

        return { id: user._id, name: user.username }; // Return user details
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Use JWT for session management
  },
  pages: {
    signIn: '/auth/signin',
  },
});
