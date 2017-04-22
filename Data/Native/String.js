const Maybe = mrequire("core:Data.Native.Maybe:1.0.0");


//= match :: RegExp -> String -> Maybe (Array String)
const match = regexp => s => {
    const match = s.match(regexp);
    return match
        ? Maybe.Just(match)
        : Maybe.Nothing;
};


//= split :: RegExp -> String -> Array String
const split = regex => s =>
    s.split(regex);


//= startsWith :: String -> String -> Bool
const startsWith = prefix => s =>
    s.startsWith(prefix);


const substring = start => end => s =
    s.substring(start, end);


const substringFrom = start => s =>
    s.substring(start);


const trim = s =>
    s.trim();


module.exports = {
    match,
    split,
    startsWith,
    substring,
    substringFrom,
    trim
};