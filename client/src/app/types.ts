
export type message={
    count:number,
    text:string
}

export default  function newConnection(){
    return  new WebSocket("ws://127.0.0.1:5000/echo");
}
