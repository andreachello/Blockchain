
export TYPEORM_DATABASE=jupiter
export TYPEORM_CONNECTION=postgres
export TYPEORM_HOST=localhost
export TYPEORM_USERNAME=postgres
export TYPEORM_PASSWORD=postgres
export TYPEORM_PORT=5432
export TYPEORM_ENTITIES=./dist/**/entities/*.js
export TYPEORM_MIGRATIONS=./dist/**/migration/*.js
export TYPEORM_ENTITIES_DIR=src/**/entities
export TYPEORM_MIGRATIONS_DIR=src/migration

npm run build

# actually do the migration
npm run typeorm:run