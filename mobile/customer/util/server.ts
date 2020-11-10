const root = "http://192.168.56.1/api";

const urls: Record<string, string> = [
  "users",
  "auth",
  "addresses",
  "orders",
  "order-logs",
].reduce((prev, cur) => ({ ...prev, [cur]: `${root}/${cur}` }), {});

const server = {
  get: (resource: string) => {
    return fetch(resource).then((res) => res.json());
  },
  post: (resource: string, data: object) => {
    return fetch(resource, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },
  put: (resource: string, data: object) => {
    return fetch(resource, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },
  delete: (resource: string) => {
    return fetch(resource, { method: "DELETE" }).then((res) => res.json());
  },
};

export function signUp(user: object) {
  return server.post(urls.users, user);
}

export function signIn(auth: object) {
  return server.post(urls.auth, auth);
}

export function getUsers() {
  return server.get(urls.users);
}

export default { signUp, signIn, getUsers };
