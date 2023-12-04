
use std::{collections::HashSet, error::Error, fs::File, io::BufRead, path::Path};

fn main() -> Result<(), Box<dyn Error>> {
    // part_one()
    part_two()
}

fn part_one() -> Result<(), Box<dyn Error>> {
    let input_file = File::open(Path::new("ex04/input.txt"))?;
    let reader = std::io::BufReader::new(input_file);
    let pairs: Vec<(HashSet<u32>, HashSet<u32>)> = reader
        .lines()
        .map(|line| line.unwrap_or_default())
        .map(|line| {
            line.split_once(':')
                .expect("Invalid input :")
                .1
                .trim()
                .to_string()
        })
        .map(|line| {
            line.split_once("|")
                .map(|(winning, my)| (winning.to_owned(), my.to_owned()))
                .expect("Invalid input |")
        })
        .map(|(winning, my)| {
            (
                winning
                    .split_ascii_whitespace()
                    .map(|num| num.parse::<u32>().expect("Invalid value"))
                    .collect::<HashSet<u32>>(),
                my.split_ascii_whitespace()
                    .map(|num| num.parse::<u32>().expect("Invalid value"))
                    .collect::<HashSet<u32>>(),
            )
        })
        .collect();
    let result: u32 = pairs
        .iter()
        .map(|(winning, my)| {
            let len: u32 = winning.intersection(my).count() as u32;
            if len == 0 {
                0
            } else {
                2_u32.pow(len - 1)
            }
        })
        .sum();
    pairs.iter().for_each(|pair| println!("{:?}", pair));
    println!("{}", result);
    Ok(())
}
fn part_two() -> Result<(), Box<dyn Error>> {
    let input_file = File::open(Path::new("ex04/input.txt"))?;
    let reader = std::io::BufReader::new(input_file);
    let pairs: Vec<(HashSet<u32>, HashSet<u32>)> = reader
        .lines()
        .map(|line| line.unwrap_or_default())
        .map(|line| {
            line.split_once(':')
                .expect("Invalid input :")
                .1
                .trim()
                .to_string()
        })
        .map(|line| {
            line.split_once("|")
                .map(|(winning, my)| (winning.to_owned(), my.to_owned()))
                .expect("Invalid input |")
        })
        .map(|(winning, my)| {
            (
                winning
                    .split_ascii_whitespace()
                    .map(|num| num.parse::<u32>().expect("Invalid value"))
                    .collect::<HashSet<u32>>(),
                my.split_ascii_whitespace()
                    .map(|num| num.parse::<u32>().expect("Invalid value"))
                    .collect::<HashSet<u32>>(),
            )
        })
        .collect();
    let mut num_of_cards = vec![1; pairs.len()];
    let result: u32 = pairs
        .iter()
        .enumerate()
        .map(|(idx, (winning, my))| {
            let len: u32 = winning.intersection(my).count() as u32;
            for i in 0..len {
                let index: usize = (idx as u32 + i + 1) as usize;
                num_of_cards[index] += num_of_cards[idx];
            }
            num_of_cards[idx]
        })
        .sum();
    println!("{:?}", num_of_cards);
    println!("{}", result);
    Ok(())
}
