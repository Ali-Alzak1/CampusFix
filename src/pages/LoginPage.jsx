import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Field from '../components/ui/Field.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import './login.css';

export default function LoginPage() {
  const { currentUser, login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (currentUser) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(identifier.trim());
    } catch (err) {
      setError(err.message ?? 'Unable to sign in.');
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <Card>
        <div className="login-head">
          <p className="text-tiny">CampusFix</p>
          <h1 className="login-title">Sign in</h1>
          <p className="text-muted">Use your `userId`, `kfupmId`, or `staffId` to continue.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <Field
            label="Identifier"
            htmlFor="identifier"
            required
            hint="Examples: 1, S202250700, M500301"
            error={error || undefined}
          >
            <input
              id="identifier"
              className="input"
              placeholder="Enter userId, kfupmId, or staffId"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="off"
            />
          </Field>

          <Button type="submit" variant="primary" disabled={!identifier.trim() || loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Card>
    </main>
  );
}
