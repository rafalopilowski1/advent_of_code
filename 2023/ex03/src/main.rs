use std::{error::Error, fs::File, io::BufRead, path::Path};

#[derive(Debug, Default, PartialEq, PartialOrd)]
struct Entry {
    value: Option<Vec<char>>,
    indexes: Vec<usize>,
}

impl Entry {
    fn new(value: Option<Vec<char>>, indexes: Vec<usize>) -> Self {
        Self { value, indexes }
    }
}

fn main() -> Result<(), Box<dyn Error>> {
    // part_one();
    part_two()
}

fn part_one() -> Result<(), Box<dyn Error>> {
    let input_file = File::open(Path::new("ex03/input.txt"))?;
    let reader = std::io::BufReader::new(input_file);
    let lines: Vec<_> = reader
        .lines()
        .map(|line| line.unwrap_or_default())
        .collect();
    let rows = lines.len();
    let columns = lines[0].len();
    let mut buffer: Vec<Entry> = vec![];
    let mut entries: Vec<Entry> = vec![];
    for (index_line, line) in lines.iter().enumerate() {
        let chars = line.chars();
        for (index_column, char) in chars.into_iter().enumerate() {
            let value = if char == '.' { None } else { Some(vec![char]) };
            buffer.push(Entry::new(
                value,
                vec![(index_line * columns + index_column)],
            ));
        }
    }
    let (numeric_entries, mut pointer_entries): (Vec<Entry>, Vec<Entry>) =
        buffer.into_iter().partition(|entry1| {
            entry1
                .value
                .as_ref()
                .is_some_and(|entry1value| entry1value.iter().all(|ch1| ch1.is_ascii_digit()))
        });
    pointer_entries.retain(|entry| entry.value.is_some());

    for entry in numeric_entries {
        let last_entry = entries.last_mut();
        if let Some(last) = last_entry {
            let last_index = last.indexes.iter().max().unwrap();
            let current_index = entry.indexes.iter().max().unwrap();

            let row_last_entry = last_index / rows;
            let column_last_entry = last_index % rows;

            let row_current_entry = current_index / rows;
            let column_current_entry = current_index % rows;

            if row_current_entry == row_last_entry {
                if column_current_entry.abs_diff(column_last_entry) == 1 {
                    let mut combined_chars = entry.value.unwrap();
                    combined_chars.append(last.value.as_mut().unwrap());
                    let mut combined_indexes = entry.indexes;
                    combined_indexes.append(&mut last.indexes);
                    entries.push(Entry::new(Some(combined_chars), combined_indexes));
                } else {
                    entries.push(entry);
                }
            } else {
                entries.push(entry);
            }
        } else {
            entries.push(entry);
        }
        entries.retain(|entry| !entry.indexes.is_empty())
    }

    let mut sum = 0;

    for pointer_entry in pointer_entries {
        let contact_numbers: Vec<_> = entries
            .iter()
            .filter(|entry| {
                entry.indexes.iter().any(|idx| {
                    let pointer_idx = pointer_entry.indexes[0];

                    let row_pointer_entry = pointer_idx / rows;
                    let column_pointer_entry = pointer_idx % rows;

                    let row_current_entry = idx / rows;
                    let column_current_entry = idx % rows;

                    row_current_entry.abs_diff(row_pointer_entry) <= 1
                        && column_current_entry.abs_diff(column_pointer_entry) <= 1
                })
            })
            .collect();
        for contact in contact_numbers {
            let mut base_ten = 1;
            for digit in contact.value.as_ref().unwrap() {
                sum += digit.to_digit(10).unwrap() * base_ten;
                base_ten *= 10;
            }
        }
    }
    println!("{}", sum);
    Ok(())
}
fn part_two() -> Result<(), Box<dyn Error>> {
    let input_file = File::open(Path::new("ex03/input.txt"))?;
    let reader = std::io::BufReader::new(input_file);
    let lines: Vec<_> = reader
        .lines()
        .map(|line| line.unwrap_or_default())
        .collect();
    let rows = lines.len();
    let columns = lines[0].len();
    let mut buffer: Vec<Entry> = vec![];
    let mut entries: Vec<Entry> = vec![];
    for (index_line, line) in lines.iter().enumerate() {
        let chars = line.chars();
        for (index_column, char) in chars.into_iter().enumerate() {
            let value = if char == '.' { None } else { Some(vec![char]) };
            buffer.push(Entry::new(
                value,
                vec![(index_line * columns + index_column)],
            ));
        }
    }
    let (numeric_entries, mut pointer_entries): (Vec<Entry>, Vec<Entry>) =
        buffer.into_iter().partition(|entry1| {
            entry1
                .value
                .as_ref()
                .is_some_and(|entry1value| entry1value.iter().all(|ch1| ch1.is_ascii_digit()))
        });
    pointer_entries.retain(|entry| entry.value.is_some());

    for entry in numeric_entries {
        let last_entry = entries.last_mut();
        if let Some(last) = last_entry {
            let last_index = last.indexes.iter().max().unwrap();
            let current_index = entry.indexes.iter().max().unwrap();

            let row_last_entry = last_index / rows;
            let column_last_entry = last_index % rows;

            let row_current_entry = current_index / rows;
            let column_current_entry = current_index % rows;

            if row_current_entry == row_last_entry {
                if column_current_entry.abs_diff(column_last_entry) == 1 {
                    let mut combined_chars = entry.value.unwrap();
                    combined_chars.append(last.value.as_mut().unwrap());
                    let mut combined_indexes = entry.indexes;
                    combined_indexes.append(&mut last.indexes);
                    entries.push(Entry::new(Some(combined_chars), combined_indexes));
                } else {
                    entries.push(entry);
                }
            } else {
                entries.push(entry);
            }
        } else {
            entries.push(entry);
        }
        entries.retain(|entry| !entry.indexes.is_empty())
    }

    let mut sum = 0;

    for pointer_entry in pointer_entries {
        let contact_numbers: Vec<_> = entries
            .iter()
            .filter(|entry| {
                entry.indexes.iter().any(|idx| {
                    let pointer_idx = pointer_entry.indexes[0];

                    let row_pointer_entry = pointer_idx / rows;
                    let column_pointer_entry = pointer_idx % rows;

                    let row_current_entry = idx / rows;
                    let column_current_entry = idx % rows;

                    row_current_entry.abs_diff(row_pointer_entry) <= 1
                        && column_current_entry.abs_diff(column_pointer_entry) <= 1
                })
            })
            .collect();
        if contact_numbers.len() == 2 {
            let num = contact_numbers.iter().map(|contact| {
                let mut local = 0;
                let mut base_ten = 1;
                for digit in contact.value.as_ref().unwrap() {
                    local += digit.to_digit(10).unwrap() * base_ten;
                    base_ten *= 10;
                }
                local
            }).product::<u32>();
            sum += num;
        }
    }
    println!("{}", sum);
    Ok(())
}
