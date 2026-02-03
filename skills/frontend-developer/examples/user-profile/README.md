# UserProfile Component Example

Complete example demonstrating:

- Loading/error/empty/data states
- Responsive design (mobile-first)
- Chinese comments
- TypeScript types
- Lazy loading images

## Usage

```tsx
import { UserProfile } from './UserProfile';

function App() {
  return <UserProfile userId="123" />;
}
```

## States Handled

1. **Loading**: Spinner while fetching data
2. **Error**: Error message with retry option
3. **Empty**: Message when user not found
4. **Data**: User profile display
