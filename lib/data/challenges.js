exports.challenges = {
	challenges: [
		{
			inputs: [
				{input: 3, output: 6},
				{input: 6, output: 720},
				{input: 7, output: 5040},
				{input: 5, output: 120}
			],
			time: 300000,
			code: "/*\nThis challenge requires that, given an integer as input, you return the factorial:\n\nInput: 5\n\nOutput: 120\n*/\n\nfunction factorial(input) {\n// fill me in.\n}\n\nreturn factorial(input); // Return the factorial of input.",
			basePoints: 20,
			filename: "factorial.js"
		},
		{
			inputs: [
				{input: [3, 4, 5, 6], output: [6, 5, 4, 3]},
				{input: [1, 2, 3, 4], output: [4, 3, 2, 1]},
				{input: [8, 9, 10, 2], output: [2, 10, 9, 8]},
				{input: [3, 2, 1, 0], output: [0, 1, 2, 3]}
			],
			time: 300000,
			code: "/*\nThis challenge requires that, given an array as input, you reverse the order of elements:\n\nInput: [1, 2, 3, 4, 5]\n\nOutput: [5, 4, 3, 2, 1]\n*/\n\nfunction reverse(input) {\n// Fill me in. \n}\n\nreturn reverse(input); // Input should be reversed.",
			basePoints: 50,
			filename: "reverse-array.js"
		},
		{
			inputs: [
				{input: ['hello', 'hello'], output: 0},
				{input: ['happy', 'nothappy'], output: 3},
				{input: ['banana', 'apple'], output: -1},
				{input: ['hat', 'funnyhat'], output: 5},
				{input: ['book', 'abook'], output: 1},
				{input: ['e', 'awesomeman'], output: 2}
			],
			time: 300000,
			code: "/*\nThis challenge requires that, given two strings, you calculate strstr see http://clc-wiki.net/wiki/strstr.\nReturn -1 if the string is not found.\n\nInput: ['happy', 'nothappy']\n\nOutput: 3\n*/\n\nfunction strstr(needle, haystack) {\n// Fill me in.\n}\n\nreturn  strstr(input[0], input[1]);",
			basePoints: 60,
			filename: "strstr.js"
		},
		{
			inputs: [
				{input: ['racecar', 'awesome', 'a', 'dogs', 'abccba'], output: ['racecar', 'a', 'abccba']},
				{input: ['madam', 'hat', 'redivider', 'banana'], output: ['madam', 'redivider']},
				{input: ['racecar', 'pep', 'cats', 'dogs', 'ipreferpi'], output: ['racecar', 'pep', 'ipreferpi']},
			],
			code: "/*\nThis challenge requires that: given an array of strings, you output an array of palindromes in the order in which they're observed.\n\nInput: ['racecar', 'apple']\n\nOutput: ['racecar']\n*/\n\nfunction findPalindromesIn(input) {\n//Fill this in.\n}\n\nreturn findPalindromesIn(input); // Return the palindromes contained in input.",
			basePoints: 100,
			time: 300000,
			filename: "palindrome.js"
		},
		{
			time: 480000,
			inputs: [
				{input: [4, 6, 8, 9, 11, 13, 4, 37], output: [11, 13, 37]},
				{input: [443, 15, 4, 431, 401, 10], output: [443, 431, 401]},
				{input: [503, 4, 2, 8, 521], output: [503, 2, 521]}
			],
			code: "/*\nThis challenge requires that, given an array of numbers, you output the prime number contained in order of observation.\n\nInput: [4, 6, 8, 9, 11, 13, 4, 37]\n\nOutput: [11, 13, 37]\n*/\n\nfunction findPrimes(input) {\n// Fill me in.\n}\n\nreturn findPrimes(input); // Return the primes contained in input.",
			basePoints: 150,
			filename: "find-prime.js"
		},
		{
			inputs: [
				{input: [1, [2, [3, 4]], [5, [6, 7]]], output: 7},
				{input: [[1, 8], [2, [3, 4]], [5, [6, 7]]], output: 8},
				{input: [[1, 8], [2, [3, [4, 5, 9]]], [5, [6, 7]]], output: 9},
				{input: [[1, 8], [2, [3, [4, 5, 9]]], [5, [[6, 10], 7]]], output: 10},
				{input: [[1, [8, 12]], [2, [3, [4, 5, 9]]], [5, [[6, 10], 7]]], output: 12}
			],
			code: "/*\nThis challenge requires that, given as input an array which may contain:\n - integer values.\n - inner-arrays of integer values.\n - any recursive combination thereof.\n Return the largest value contained in the array or any of its sub-arrays.\n\nInput: [1, [2, [3, 4]], [5, [6, 7]]]\n\nOutput: 7\n*/\n\nreturn  recursiveMax(input);",
			basePoints: 200,
			filename: "recursive-max.js",
			time: 480000
		},
		{
			inputs: [
				{input: ['hello', 'hello'], output: 0},
				{input: ['racecar', 'car'], output: 4},
				{input: ['banana', 'apple'], output: 5},
				{input: ['duck', 'snow'], output: 4},
				{input: ['book', 'books'], output: 1},
				{input: ['a', 'awesomeman'], output: 9}
			],
			code: "/*\nThis challenge requires that you calculate the Levenshtein's distance between two strings. Levenshtein's distance is the measurement of the number of modifications required to transform one string into another, read about it here. (http://en.wikipedia.org/wiki/Levenshtein_distance)\n\nInput: ['bananas', 'banana']\n\nOutput: 1\n*/\n\nreturn  levenshteinDistance(input[0], input[1]); // Return Levenshtein's distance of the two strings in the array.",
			basePoints: 300,
			filename: "levenshtein.js",
			time: 720000
		},
		{
			inputs: [
				{input: [['cat', 'dog', 'hello', 'foobar'], ['06d80eb0c50b49a509b49f2424e8c805', '5d41402abc4b2a76b9719d911017c592']], output: ['dog', 'hello']},
				{input: [['cat', 'ice', 'hello', 'ducks'], ['7bdff76536f12a7c5ffde207e72cfe3a', 'd0c3251252aa3ba6a806464d2de418b2']], output: ['ice', 'ducks']},
				{input: [['dog', 'freak', 'hello', 'ducks'], ['7294001ae51b8cdfd50eb4459ee28182']], output: ['freak']},
				{input: [['amazing', 'freak', 'cheat', 'ducks'], ['922c8158165d7c6528b9194c86b54b01', 'd0c3251252aa3ba6a806464d2de418b2']], output: ['amazing', 'ducks']}
			],
			code: "/*Given input[0] is an array of strings and input[2] is an array of MD5 hashed strings. Return an array of the plain-text strings from the first array (maintaining the same order) that have corresponding MD5 hashes in the second array.\n\nInput: [['bananas', 'banana']], ['72b302bf297a228a75730123efef7c41', '1f3870be274f6c49b3e31a0c6728957f']\n\nOutput: ['banana']\n*/\n\nreturn  filter(input[0], input[1]);",
			basePoints: 350,
			filename: "filter.js",
			time: 720000
		}
	]
}