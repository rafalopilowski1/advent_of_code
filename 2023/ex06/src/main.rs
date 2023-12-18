use std::{error::Error, fs::File, io::BufRead, path::Path};

fn main() -> Result<(), Box<dyn Error>> {
    let input_file = File::open(Path::new("ex06/input.txt"))?;
    let reader = std::io::BufReader::new(input_file);
    let lines: Vec<String> = reader
        .lines()
        .map(|line| line.unwrap_or_default())
        .collect();
    let splitted_lines: Vec<Vec<&str>> = lines
        .iter()
        .map(|line| {
            line.split_whitespace()
                .filter(|spl| spl.chars().all(|ch| ch.is_numeric()))
                .collect()
        })
        .collect();
    if splitted_lines.len() == 2 {
        // let pairs: Vec<(u32, u32)> = part_one(splitted_lines)?;
        let pairs: Vec<(u64, u64)> = part_two(splitted_lines)?;
        // println!("{:?}", pairs);
        let mut result = 1usize;
        for (time, distance) in pairs {
            let possile_distances: Vec<(u64, u64)> = (1..time)
                .map(|i| (i, (time - i) * i))
                .filter(|(_, dist)| dist > &distance)
                .collect();
            // println!("{:?}", possile_distances);
            result *= possile_distances.len();
        }
        println!("{}", result);
        Ok(())
    } else {
        Err("Invalid input!".into())
    }
}

fn part_one(splitted_lines: Vec<Vec<&str>>) -> Result<Vec<(u64, u64)>, Box<dyn Error>> {
    let result = splitted_lines[0]
        .iter()
        .zip(splitted_lines[1].iter())
        .map(|(one, two)| {
            (
                one.parse().unwrap_or_default(),
                two.parse().unwrap_or_default(),
            )
        })
        .collect();
    Ok(result)
}
fn part_two(splitted_lines: Vec<Vec<&str>>) -> Result<Vec<(u64, u64)>, Box<dyn Error>> {
    let (time, distance) =
        splitted_lines[0]
            .iter()
            .zip(splitted_lines[1].iter())
            .fold(("".to_owned(), "".to_owned()), |mut acc, two| {
                acc.0 += two.0;
                acc.1 += two.1;
                acc
            });
    let result:(u64,u64) = (time.parse().unwrap_or_default(),distance.parse().unwrap_or_default());
    Ok(vec![result])
}
