# auth-server

## Development

Start development server by running `npm run dev`.

## Running in docker

```bash
docker build . -t auth-server
docker run --rm -it -v $(pwd)/private.pem:/app/private.pem -v $(pwd)/public.pem:/app/public.pem -v $(pwd)/.env:/app/.env -p 7000:7000 auth-server:latest
```
