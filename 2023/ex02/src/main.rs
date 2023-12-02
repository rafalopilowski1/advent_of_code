use std::{error::Error, fs::File, io::BufRead, path::Path};

fn main() -> Result<(), Box<dyn Error>> {
    // part_one()
    part_two()
}

fn part_one() -> Result<(), Box<dyn Error>> {
    let input_file = File::open(&Path::new("ex02/input.txt"))?;
    let reader = std::io::BufReader::new(input_file);
    let lines = reader.lines();
    let mut sum = 0;
    'lines: for line in lines {
        let (mut red, mut green, mut blue) = (12i32, 13i32, 14i32);
        let line = line?;
        println!("{}", line);
        let (index_part, rounds) = line.split_once(":").unwrap_or_default();
        let (_, index_str) = index_part.split_once(' ').unwrap_or_default();
        let index: u32 = index_str.parse()?;
        for round in rounds.trim().split(';') {
            for bucket in round.split(",") {
                let (num, color) = bucket.trim().split_once(' ').unwrap_or_default();
                let number: i32 = num.parse()?;
                println!("{} {}", number, color);
                match color {
                    "red" => red -= number,
                    "green" => green -= number,
                    "blue" => blue -= number,
                    _ => continue,
                }
                if red < 0 || green < 0 || blue < 0 {
                    continue 'lines;
                }
                (red, green, blue) = (12, 13, 14);
            }
        }
        if red >= 0 && green >= 0 && blue >= 0 {
            println!("Adding {}!", index);
            sum += index
        }
    }
    println!("{}", sum);
    Ok(())
}

fn part_two() -> Result<(), Box<dyn Error>> {
    let input_file = File::open(&Path::new("ex02/input.txt"))?;
    let reader = std::io::BufReader::new(input_file);
    let lines = reader.lines();
    let mut sum = 0;
    for line in lines {
        let (mut red, mut green, mut blue) = (0, 0, 0);
        let line = line?;
        println!("{}", line);
        let (_, rounds) = line.split_once(":").unwrap_or_default();
        for round in rounds.trim().split(';') {
            for bucket in round.split(",") {
                let (num, color) = bucket.trim().split_once(' ').unwrap_or_default();
                let number: i32 = num.parse()?;
                println!("{} {}", number, color);
                match color {
                    "red" => {
                        if red <= number {
                            red = number
                        }
                    }
                    "green" => {
                        if green <= number {
                            green = number
                        }
                    }
                    "blue" => {
                        if blue <= number {
                            blue = number
                        }
                    }
                    _ => continue,
                }
            }
        }
        let inc = red * green * blue;
        println!("Adding {}!", inc);
        sum += inc;
    }
    println!("{}", sum);
    Ok(())
}
