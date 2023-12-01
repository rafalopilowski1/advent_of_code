use std::collections::HashMap;
use std::error::Error;
use std::fs::File;
use std::io::BufRead;
use std::path::Path;


fn main() -> Result<(), Box<dyn Error>> {
    let word_number_match: HashMap<&'static str, u32> = HashMap::from([
        // Part 2 -> uncomment
        // ("one", 1),
        // ("two", 2),
        // ("three", 3),
        // ("four", 4),
        // ("five", 5),
        // ("six", 6),
        // ("seven", 7),
        // ("eight", 8),
        // ("nine", 9),
        ("1", 1),
        ("2", 2),
        ("3", 3),
        ("4", 4),
        ("5", 5),
        ("6", 6),
        ("7", 7),
        ("8", 8),
        ("9", 9),
    ]);
    let input_file = File::open(&Path::new("ex01/input.txt"))?;
    let reader = std::io::BufReader::new(input_file);
    let mut sum = 0;
    for line in reader.lines() {
        let line = line?;
        let mut first_number = 0u32;
        let mut last_number = 0u32;
        let mut min_index = u32::MAX;
        let mut max_index = u32::MIN;
        println!("{}", &line);
        for num in word_number_match.iter() {
            if let Some(index) = line.find(num.0) {
                let index = index as u32;
                if index < min_index {
                    min_index = index;
                    first_number = *num.1;
                }
            }
            if let Some(index) = line.rfind(num.0) {
                let index = index as u32;
                if index >= max_index {
                    max_index = index;
                    last_number = *num.1;
                }
            }
        }
        println!("{} {}", first_number, last_number);
        let number = 10 * first_number + last_number;
        sum += number;
    }
    println!("{}", sum);
    Ok(())
}
