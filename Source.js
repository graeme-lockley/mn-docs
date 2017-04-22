const Array = mrequire("core:Data.Array:v1.0.0");
const FileSystem = require("./System/IO/Native/FileSystem");
const Maybe = mrequire("core:Data.Maybe:v1.0.0");
const NativeArray = mrequire("core:Data.Native.Array:1.0.0");
const NativeString = require("./Data/Native/String");


const newlineSplitter = NativeString.split(/\n/);
const mrequireMatch = NativeString.match(/mrequire\w*\(\w*["'](.*)["']\w*\)/);


function removeComment(s) {
    return NativeString.trim(NativeString.substringFrom(3)(s));
}


function parseSource(source) {
    const input = newlineSplitter(source);

    let state = 0; // 0 = start, 1 = parsing header, 2 = adding imports, 3 = parsing function header, 4 = parsing assumptions

    let header = Array.empty;
    let imports = Array.empty;
    let functions = Array.empty;

    let currentFunctionHeader = Array.empty;
    let currentFunctionSignature = Maybe.Nothing;
    let currentFunctionAssumptions = Array.empty;

    for (let index = 0; index < input.length; index += 1) {
        const line = input[index];
        switch (state) {
            case 0:
                if (NativeString.startsWith("//-")(line)) {
                    header = header.append(removeComment(line));
                    state = 1;
                } else {
                    const match = mrequireMatch(line);
                    if (match.isJust()) {
                        imports = imports.append(match.reduce(() => "")(a => NativeArray.at(a)(1).reduce(() => "")(i => i)));
                    }
                    state = 2;
                }
                break;
            case 1:
                if (NativeString.startsWith("//-")(line)) {
                    header = header.append(removeComment(line));
                    break;
                } else {
                    state = 2;
                }
            case 2:
                if (NativeString.startsWith("//-")(line) || NativeString.startsWith("//=")(line)) {
                    state = 3;
                } else {
                    const match = mrequireMatch(line);
                    if (match.isJust()) {
                        imports = imports.append(match.reduce(() => "")(a => NativeArray.at(a)(1).reduce(() => "")(i => i)));
                    }
                    break;
                }
            case 3:
                if (NativeString.startsWith("//-")(line)) {
                    currentFunctionHeader = currentFunctionHeader.append(removeComment(line));
                    state = 3;
                } else if (NativeString.startsWith("//=")(line)) {
                    currentFunctionSignature = Maybe.Just(removeComment(line));
                    state = 4;
                } else {
                    state = 4;
                }
                break;
            case 4:
                if (NativeString.startsWith("//-")(line) || NativeString.startsWith("//=")(line)) {
                    if (currentFunctionSignature.isJust()) {
                        functions = functions.append({
                            header: currentFunctionHeader,
                            signature: currentFunctionSignature,
                            assumptions: currentFunctionAssumptions
                        });
                        currentFunctionHeader = Array.empty;
                        currentFunctionSignature = Maybe.Nothing;
                        currentFunctionAssumptions = Array.empty;
                    }
                    if (NativeString.startsWith("//-")(line)) {
                        currentFunctionHeader = currentFunctionHeader.append(removeComment(line));
                        state = 3;
                    } else if (NativeString.startsWith("//=")(line)) {
                        currentFunctionSignature = Maybe.Just(removeComment(line));
                        state = 4;
                    }
                }
        }
    }
    if (currentFunctionSignature.isJust()) {
        functions = functions.append({
            header: currentFunctionHeader,
            signature: currentFunctionSignature,
            assumptions: currentFunctionAssumptions
        });
    }

    return {
        header: header,
        imports: imports,
        functions: functions
    };
}


// FileSystem.readFile("./Source.js")
//     .then(console.log)
//     .catch(console.log);


module.exports = {
    parseSource
};