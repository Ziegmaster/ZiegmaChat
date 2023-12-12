const { readFileSync } = require('fs');
const Ajv = require('ajv');

const ajv = new Ajv();

module.exports = {
    parseConfig : function( inputFile, schemaFile ) {

        function readJsonFile(file) {
            let raw = readFileSync(file);
            return JSON.parse(raw);
        }

        let input = readJsonFile(inputFile);
        let schema = readJsonFile(schemaFile);

        const isValid = ajv.validate(schema, input);

        if (!isValid) {
            return undefined;
        }

        return input;
    }
};