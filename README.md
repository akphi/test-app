# TODO

- [ ] E2E - https://github.com/finos/legend-studio/issues/184
- [x] Check if we can use `YAML`
- [x] Check to use `localhost` for mongo
- [x] Generate `docker-compose.yml` from template - bypassing `.env` file
- [x] Setup github actions workflow
  - [x] Generate from templates
  - [x] Run the docker-compose
  - [x] Check the servers and studio is running fine `http://localhost:8080/studio/config.json` (or some healthcheck - not so sure)
  - [x] Verify the endpoint `http://localhost:7070/api/sever/info` and `http://localhost:6060/api/server/v1/info` work fine
  - [x] Start running the test
- [x] Setup some tests to run
  - [ ] Call up