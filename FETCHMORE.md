## Pagination using fetchMore

**References:**
- [@apollo/react-hooks](https://www.apollographql.com/docs/react/api/react-hoc/#graphql-options-for-queries)
- [fetchMore - Relay-style cursor pagination](https://www.apollographql.com/docs/react/data/pagination/#relay-style-cursor-pagination)


**Backend - Playground Results**
```js
{
  "data": {
    "usersConnection": {
      "pageInfo": {
        "hasNextPage": true, //<--- POINT!
        "endCursor": "ck3oqgoy606ld0794kasxvr1a"//<--- !!POINT
      },
      "edges": [
        {
          "node": {
            "id": "ck3opreyf06l80794e8xw67sg",
            "name": "hiroko"
          }
        },
        {
          "node": {
            "id": "ck3oqgoy606ld0794kasxvr1a",
            "name": "daisuke"
          }
        }
      ]
    }
  }
}
```

**React- graphql**

```js
const USERS_CONNECTION = gql`
  query UsersConnection($first:Int){
    usersConnection(first: $first){
      pageInfo{
        hasNextPage
        endCursor
      }
      edges{
        node{
          id
          name
          email
        }
      }
      aggregate{
        count
      }
    }
  }
`
```

**React Component with fetch more button**
```js
const UsersFetchMorePage = () =>{
  const { loading, error, data, fetchMore } = useQuery(USERS_CONNECTION, {
    variables: {first: 2}
  });
  const pageInfo = get(data, "usersConnection.pageInfo", {});	
  const users = get(data, "usersConnection.edges", []);

  const { fetchingMore, fetchMoreData } = useLoadMore(
    loading,
    error,
    fetchMore,
    pageInfo
  );	

  return (
    <div>
    {loading ? (
      <p>Loading...</p>
    ):(
      <div>
        {users.map(({node}, index) => {
          return (
            <p key={`${node.id}_${index}`}>{node.id}/{node.name}</p>
          )
        })}
        {pageInfo.hasNextPage && (
          <button
            onClick={() => {
              fetchMoreData();
            }}
          >
            {fetchingMore ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    )}
    </div>		
  )
}
```

**React - fetchmore function**
```js
const useLoadMore = (loading, error, fetchMore, pageInfo) => {
  const [fetchingMore, updateFetchingMore] = useState(false);
  const { hasNextPage, endCursor } = pageInfo;
  const first = 2;

  const fetchMoreData = () => {
    if (!loading && !error) {
      if (hasNextPage) {
        updateFetchingMore(true);
        fetchMore({
          variables: {
            first: first,
            after: endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }

            const previousEdges = get(
              previousResult,
              "usersConnection.edges",
              []
            );
            const nextEdges = get(
              fetchMoreResult,
              "usersConnection.edges",
              []
            );
            const nextPageInfo = get(
              fetchMoreResult,
              "usersConnection.pageInfo",
              {}
            );
            set(
              fetchMoreResult,
              "usersConnection.edges",
              concat(previousEdges, nextEdges)
            );
            set(fetchMoreResult, "usersConnection.pageInfo", nextPageInfo);
            return fetchMoreResult;
          }
        })
          .then(() => {
            updateFetchingMore(false);
          })
          .catch(() => {
            updateFetchingMore(false);
          });
      }
    }
  };

  return {
    fetchingMore,
    fetchMoreData
  };
};
```
