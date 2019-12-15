import { gql } from 'apollo-boost'

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
	query UsersConnection($first: int ){
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