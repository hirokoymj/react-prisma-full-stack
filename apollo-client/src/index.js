import ApolloBoost, { gql } from 'apollo-boost'
import React, { Fragment, useState } from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { useQuery } from '@apollo/react-hooks';
import get from "lodash/get";
import set from "lodash/set";
import map from "lodash/map";
import concat from "lodash/concat";

// export const FLEET_LISTINGS = gql`
//   query FleetListings(
const USERS = gql`
	query Users{
		users {
				id
				name
				email
		}
	}
`

const USER_BY_ID = gql`
	query UserByID($id: ID){
		user(where: {id: $id}) {
				id
				name
				email
		}
	}
`

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

const UsersPage = () => {
	const { loading, error, data } = useQuery(USERS);
	const users = get(data, "users", {});

	return (
		<div>
			{loading ? (
				<p>loading</p>
				):(
					<div>
					<h3>ALl User</h3>
					{users.map( user =>(
						<div key={user.id}>{user.name}</div>
					))}
					</div>
				)}
		</div>
	);
}

const SingleUserPage = () =>{
	const {loading, error, data } = useQuery(USER_BY_ID, {
		variables: {id: "ck3opreyf06l80794e8xw67sg"}
	});
	const user = get(data, "user", {});
	const {id, name, email} = user;

	return (
		<div>{
			loading ? (<p>Loading...</p>) : (
				<div>
					<h3>Single User</h3>
					<p>{`${id} ${name} ${email}`}</p>
				</div>
			)
		}</div>
	)
}

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
						console.log("prev")
						console.log(previousEdges);
						console.log("===");
						console.log(nextEdges);

            set(
              fetchMoreResult,
              "usersConnection.edges",
              concat(previousEdges, nextEdges)
            );
						console.log("===");
						console.log(fetchMoreResult);
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

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
})

const App = () => (
  <ApolloProvider client={client}>
    <div>
			<UsersPage />
			<hr />
			<SingleUserPage />
			<hr />
			<h3>FetchMore</h3>
			<UsersFetchMorePage/>
    </div>
  </ApolloProvider>
);

render(<App />, document.getElementById('root'));
