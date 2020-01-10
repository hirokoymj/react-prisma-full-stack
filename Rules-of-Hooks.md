# Rules of Hooks

1. Only Call Hooks at the Top Level
>Don’t call Hooks inside loops, conditions, or nested functions. Instead, always use Hooks at the top level of your React function.

2. Only Call Hooks from React Functions
>Don’t call Hooks from regular JavaScript functions.

3. Exception about 2.
>A custom Hook is a JavaScript function whose name starts with ”use” and that may call other Hooks.

4. Can use multiple hooks. ex. `useState`, `useEffect`
<hr />


# Commonly used Hooks

- `useState()`, `useEffect()` - from React 16.8
- `useQuery()` - from React apollo
- `useHistory()` - from React Router
- `useParams()` - from React Router

```js
let { id } = useParams();
```

**Example 1**

```js
const { data } = useQuery(CURRENT_USER_QUERY, {
 fetchPolicy: "cache-only"
});
```

**Example 2**
```js
useEffect(() => {
 if (matches) {
   disableHeader();
 } else {
   enableHeader();
 }

 return enableHeader;
}, [matches, enableHeader, disableHeader]);
```

#### References:

- [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html)
- [Extracting a Custom Hook](https://reactjs.org/docs/hooks-custom.html#extracting-a-custom-hook)
- [Hooks](https://reacttraining.com/react-router/web/api/Hooks)
