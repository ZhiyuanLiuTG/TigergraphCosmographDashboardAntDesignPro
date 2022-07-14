// import { InputNode, InputLink } from './types'
import 'btoa'

export type InputNode = {
    [key: string]: unknown;
    id: string;
    x?: number;
    y?: number;
}

export type InputLink = {
    [key: string]: unknown;
    source: string;
    target: string;
}

export class TigerGraphConnection<N extends InputNode, L extends InputLink> {
  host: string;
  graphname: string;
  username: string;
  password: string;
  token: string;
 
  constructor(host: string, graphname: string, username: string, password: string, token?: string) {
    this.host = host;
    this.graphname = graphname;
    this.username = username;
    this.password = password;
    this.token = token ? token : "";
  }

  async generateToken() {
    return fetch(`${this.host}:9000/requesttoken`, {
        method: 'POST',
        body: `{"graph": "${this.graphname}"}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+btoa(`${this.username}:${this.password}`),
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
    
        return response.json();
    }).then(data => {
        this.token = data.results.token;
        return this.token;
    });
  }

  async createConnection() {
    return fetch(`http://127.0.0.1:8010/createConnection?host=${this.host}&graphname=${this.graphname}&username=${this.username}&password=${this.password}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
        return response.json();
    }).then(res => {
        console.log(res);
    });
  }

  async getTigerGraphData(vertex_type: Array<string>, edge_type: Array<string>) : Promise<{ nodes: N[]; links: L[]; }> {
    return fetch(`http://127.0.0.1:8010/createConnection`, {
        method: 'GET',
        body: `{}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic '+btoa(`${this.username}:${this.password}`),
        }
    }).then(response => {
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
    
        return response.json();
    }).then(data => {
  
        const links: L[] = [];
        const nodes: N[] = [];
  
        if (data.error) {
          throw new Error(`Error! status: ${data.message}`);
        }
  
        let vertices = data.results[0]["Seed"];
        let edges = data.results[1]["edges"];
        for (let vertex in vertices) nodes.push({...(vertices[vertex].attributes), ...({id: `${vertices[vertex].v_type}_${vertices[vertex].v_id}`, v_id: `${vertices[vertex].v_id}`, v_type: `${vertices[vertex].v_type}`})});
        for (let edge in edges) links.push({...(edges[edge].attributes), ...{ source: `${edges[edge].from_type}_${edges[edge].from_id}`, target: `${edges[edge].to_type}_${edges[edge].to_id}`}});
  
        return {"nodes": nodes, "links": links};
    });
  }

    async runInterpretedQuery(interpreted_query: string) : Promise<{ nodes: N[]; links: L[]; }> {
        return fetch(`${this.host}:14240/gsqlserver/interpreted_query`, {
            method: 'POST',
            body: interpreted_query,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+btoa(`${this.username}:${this.password}`),
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
        
            return response.json();
        }).then(data => {
            const links: L[] = [];
            const nodes: N[] = [];

            if (data.error) {
                throw new Error(`Error! status: ${data.message}`);
            }

            data = data.results;
        
            for (let res in data) {
                for (let key in data[res]) {
                    let vertices = data[res][key];
                    for (let vertex in vertices) {
                        if (vertices[vertex].v_type === undefined || vertices[vertex].v_id === undefined) break;
                        nodes.push({...(vertices[vertex].attributes), ...({id: `${vertices[vertex].v_type}_${vertices[vertex].v_id}`, v_id: `${vertices[vertex].v_id}`, v_type: `${vertices[vertex].v_type}`})});          
                    }
                    let edges = data[res][key];
                    for (let edge in edges) {
                        if (edges[edge].from_type === undefined || edges[edge].to_type === undefined) break;
                        links.push({...(edges[edge].attributes), ...{ source: `${edges[edge].from_type}_${edges[edge].from_id}`, target: `${edges[edge].to_type}_${edges[edge].to_id}`}});
                    }
                }
            }
            if (nodes.length === 0) {
                throw new Error("No vertices detected");
            } else if (links.length === 0) {
                throw new Error("No edges detected");
            }
            return {"nodes": nodes, "links": links};
        });
    }

    async runQuery(query_name: string, params?: JSON) : Promise<{ nodes: N[]; links: L[]; }> {
        return fetch(`http://127.0.0.1:8010/installedQuery/${query_name}`, {
            method: 'GET'
            // body: params ? JSON.stringify(params) : "{}",
            // headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': 'Bearer '+this.token,
            // }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
        
            return response.json();
        }).then(data => {
            // data = data.results;

            const links: L[] = [];
            const nodes: N[] = [];
        
            for (let res in data) {
                for (let key in data[res]) {
                    let vertices = data[res][key];
                    for (let vertex in vertices) {
                        if (vertices[vertex].v_type === undefined || vertices[vertex].v_id === undefined) break;
                        nodes.push({...(vertices[vertex].attributes), ...({id: `${vertices[vertex].v_type}_${vertices[vertex].v_id}`, v_id: `${vertices[vertex].v_id}`, v_type: `${vertices[vertex].v_type}`})});          
                    }
                    let edges = data[res][key];
                    for (let edge in edges) {
                        if (edges[edge].from_type === undefined || edges[edge].to_type === undefined) break;
                        links.push({...(edges[edge].attributes), ...{ source: `${edges[edge].from_type}_${edges[edge].from_id}`, target: `${edges[edge].to_type}_${edges[edge].to_id}`}});
                    }
                }
            }
            if (nodes.length === 0) {
                throw new Error("No vertices detected");
            } else if (links.length === 0) {
                throw new Error("No edges detected");
            }
            return {"nodes": nodes, "links": links};
        });
    }

    async runInstalledQuery(query_name: string, params?: JSON) : Promise<{ nodes: N[]; links: L[]; }> {
        if (this.token === "") {
            return this.generateToken().then(() => this.runQuery(query_name, params));
        } else return this.runQuery(query_name, params);
    }

    async queries() {
        return fetch(`http://127.0.0.1:8010/getQueries`, {
            method: 'GET'
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
        
            return response.json();
        }).then(data => {
            console.log(data);
            return data;
        })
    }

    async listQueries() {
        if (this.token === "") {
            return this.generateToken().then(() => this.queries());
        } else return this.queries();
    }
    
    async getVertexEdgeTypes(): Promise<{edges: string[], vertices: string[]}>{
        return fetch(`${this.host}:14240/gsqlserver/gsql/schema?graph=${this.graphname}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+btoa(`${this.username}:${this.password}`),
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
        
            return response.json();
        }).then(data => {
            console.log(data);
            let edges: string[] = [];
            let vertices: string[] = [];
            let types = {edges: edges, vertices: vertices};
            let edgeTypes = data.results.EdgeTypes;
            let vertexTypes = data.results.VertexTypes;
            for(let i in edgeTypes){
                types.edges.push(edgeTypes[i].Name as string);
            }
            for(let i in vertexTypes){
                types.vertices.push(vertexTypes[i].Name);
            }
            
            return types;
        })
    }

    async listVertexEdgeTypes(){
        if (this.token === "") {
            return this.generateToken().then(() => this.getVertexEdgeTypes());
        } else return this.getVertexEdgeTypes();

    }
    
}