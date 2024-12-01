export type UserRole = {
    name: string
    email: string
    roles:[{
        id:number,
        description:string
        status:boolean
        pages:[{
            id:number,
            code:string,
            description:string
        }]
    }]
    adminAuthentication:boolean
    status:boolean
}