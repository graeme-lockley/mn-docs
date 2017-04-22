const Assert = require("assert");
const FS = require("fs");
const Unit = mrequire("core:Test.Unit:v1.0.0");

const Source = require("../Source");

const suite = Unit.newSuite("Parse JavaScript Input Suite");


forAllScenariosIn(__dirname + "/ParseInputScenarios", (name, input, expectations) => {
    if ("doc" in expectations) {
        suite.case(name, () => {
            const output = JSON.stringify(Source.parseSource(input), null, 2);
            if (output !== expectations["doc"]) {
                console.error(`Output: ${output}\n\nExpectation: ${expectations["doc"]}`)
            }
            Assert.deepEqual(output, expectations["doc"]);
        });
    }
})
;


function forAllScenariosIn(location, assertions) {
    FS.readdirSync(location).forEach(f => {
        const contents = FS.readFileSync(location + '/' + f).toString().split('\n');

        let name = '';
        let input = [];
        let currentExpectation;
        let expectations = {};
        let output = [];

        let state = 0;

        for (let index = 0; index < contents.length; index += 1) {
            if (state === 0) {
                name = contents[index].substring(2).trim();
                state = 1;
            } else if (state === 1) {
                if (contents[index].startsWith('--')) {
                    currentExpectation = contents[index].substring(2).trim();
                    output = [];
                    state = 3;
                } else {
                    input.push(contents[index]);
                }
            } else {
                if (contents[index].startsWith('--')) {
                    expectations[currentExpectation] = output.join('\n');
                    currentExpectation = contents[index].substring(2).trim();
                    output = [];
                } else {
                    output.push(contents[index]);
                }
            }
        }

        expectations[currentExpectation] = output.join('\n');

        assertions(f + ": " + name, input.join('\n'), expectations);
    });
}