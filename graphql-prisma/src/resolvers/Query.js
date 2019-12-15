const Query = {
		async users(parent, args, { prisma }, info){
			return await prisma.query.users(args, info);
		},
		async usersConnection(parent, args, { prisma }, info){
			return await prisma.query.usersConnection(args, info)
		},
		async user(parent, args, { prisma }, info){
			return await prisma.query.user(args, info);
		},		
		//  async users(parent, args, { prisma }, info) {
			
		// 	const options = Object.keys(args).reduce((acc, key) =>{
		// 		if(key === 'query'){
		// 			acc['where'] = {
		// 				OR: [{
		// 						name_contains: args['query']
		// 				}, {
		// 						email_contains: args['query']
		// 				}]
		// 			}
		// 		}else{
		// 			acc[key]
		// 		}
		// 		return acc;				
		// 	}, {});

		// 	//return prisma.query.users(options);
		// 	const users = await prisma.query.users(options, info);
		// 	return users
		// },
    // posts(parent, args, { prisma }, info) {
		// 	const opArgs = {}
		// 	console.log(args.query);

		// 	if(args.query){
		// 		opArgs.where = {
		// 			OR: [{
		// 				title_contains : args.query
		// 			},{
		// 				body_contains: args.query
		// 			}]
		// 		}
		// 	}
		// 	return prisma.query.posts(opArgs, info);
    // },
    // comments(parent, args, { prisma }, info) {
		// 	return prisma.query.comments(null, info)
		// },
    // me() {
    //     return {
    //         id: '123098',
    //         name: 'Mike',
    //         email: 'mike@example.com'
    //     }
    // },
    // post() {
    //     return {
    //         id: '092',
    //         title: 'GraphQL 101',
    //         body: '',
    //         published: false
    //     }
    // }
}

export { Query as default }