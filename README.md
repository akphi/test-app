# TODO

- [ ] E2E - https://github.com/finos/legend-studio/issues/184
- [x] Check if we can use `YAML`
- [x] Check to use `localhost` for mongo
- [x] Generate `docker-compose.yml` from template - bypassing `.env` file
- [ ] Setup github actions workflow
  - [ ] Generate from templates
  - [ ] Run the docker-compose
  - [ ] Check the servers and studio is running fine `http://localhost:8080/studio/config.json` (or some healthcheck - not so sure)
  - [ ] Verify the endpoint `http://localhost:7070/api/sever/info` and `http://localhost:6060/api/server/v1/info` work fine
  - [ ] Start running the test
- [ ] Setup some tests to run
  - [ ] Call up 2