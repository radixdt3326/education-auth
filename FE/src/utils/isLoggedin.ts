export const isUserloggedIn = (role: string)=>{
    const token = localStorage.getItem("sessId");
    const sessionRole = localStorage.getItem("role");

    if( token && sessionRole == role) return true;
    return false;
}