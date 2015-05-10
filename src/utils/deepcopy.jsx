export default function(inp){
    // this is how we (inefficiently) deep copy
    return JSON.parse(JSON.stringify(inp));
}