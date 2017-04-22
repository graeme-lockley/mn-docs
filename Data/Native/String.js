const Maybe = mrequire("core:Data.Native.Maybe:1.0.0");


//= length :: String -> Int
const length = s =>
    s.length;


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


//= substring :: Int -> Int -> String -> String
const substring = start => end => s =>
    s.substring(start, end);


//= substringFrom :: Int -> String -> String
const substringFrom = start => s =>
    s.substring(start);


//= trim :: String -> String
const trim = s =>
    s.trim();


module.exports = {
    length,
    match,
    split,
    startsWith,
    substring,
    substringFrom,
    trim
};