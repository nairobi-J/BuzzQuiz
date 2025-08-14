import App from './App';
import { AuthProvider } from './Provider';

export default function Home() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}