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

fn digits_chars_to_number(contact: &&Entry) -> u32 {
    let mut local = 0;
    let mut base_ten = 1;
    for digit in contact.value.as_ref().unwrap() {
        local += digit.to_digit(10).unwrap() * base_ten;
        base_ten *= 10;
    }
    local
}

fn get_coords(idx: &usize, rows: &usize) -> (usize, usize) {
    let row_idx = idx / rows;
    let column_idx = idx % rows;
    (row_idx, column_idx)
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

    lines.iter().enumerate().for_each(|(index_line, line)| {
        let chars = line.chars();
        chars
            .into_iter()
            .enumerate()
            .for_each(|(index_column, char)| {
                let value = if char == '.' { None } else { Some(vec![char]) };
                buffer.push(Entry::new(
                    value,
                    vec![(index_line * columns + index_column)],
                ));
            });
    });

    let (numeric_entries, mut pointer_entries): (Vec<Entry>, Vec<Entry>) =
        buffer.into_iter().partition(|entry1| {
            entry1
                .value
                .as_ref()
                .is_some_and(|entry1value| entry1value.iter().all(|ch1| ch1.is_ascii_digit()))
        });

    pointer_entries.retain(|entry| entry.value.is_some());

    numeric_entries.into_iter().for_each(|entry| {
        let last_entry = entries.last_mut();
        if let Some(last) = last_entry {
            let last_index = last.indexes.iter().max().unwrap();
            let current_index = entry.indexes.iter().max().unwrap();

            let row_last_entry = last_index / rows;
            let column_last_entry = last_index % rows;

            let row_current_entry = current_index / rows;
            let column_current_entry = current_index % rows;

            if row_current_entry == row_last_entry
                && column_current_entry.abs_diff(column_last_entry) == 1
            {
                let mut combined_chars = entry.value.unwrap();
                combined_chars.append(last.value.as_mut().unwrap());
                let mut combined_indexes = entry.indexes;
                combined_indexes.append(&mut last.indexes);
                entries.push(Entry::new(Some(combined_chars), combined_indexes));
                entries.retain(|entry| !entry.indexes.is_empty())
            } else {
                entries.push(entry);
            }
        } else {
            entries.push(entry);
        }
    });

    let mut sum = 0;

    pointer_entries.into_iter().for_each(|pointer_entry| {
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

        contact_numbers.into_iter().for_each(|contact| {
            let mut base_ten = 1;
            for digit in contact.value.as_ref().unwrap() {
                sum += digit.to_digit(10).unwrap() * base_ten;
                base_ten *= 10;
            }
        });
    });

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

    lines.iter().enumerate().for_each(|(index_row, line)| {
        line.chars().enumerate().for_each(|(index_column, char)| {
            buffer.push(Entry::new(
                if char == '.' { None } else { Some(vec![char]) },
                vec![(index_row * columns + index_column)],
            ));
        });
    });

    let (numeric_entries, mut pointer_entries): (Vec<Entry>, Vec<Entry>) =
        buffer.into_iter().partition(|entry| {
            entry
                .value
                .as_ref()
                .is_some_and(|entry_value| entry_value.iter().all(|ch| ch.is_ascii_digit()))
        });

    pointer_entries.retain(|entry| entry.value.is_some());

    numeric_entries.into_iter().for_each(|entry| {
        let last_entry = entries.last_mut();
        if let Some(last) = last_entry {
            let last_index = last.indexes.iter().max().unwrap();
            let current_index = entry.indexes.iter().max().unwrap();

            let (row_last_entry, column_last_entry) = get_coords(last_index, &rows);
            let (row_current_entry, column_current_entry) = get_coords(current_index, &rows);

            if row_current_entry == row_last_entry
                && column_current_entry.abs_diff(column_last_entry) == 1
            {
                let mut combined_chars = entry.value.unwrap();
                combined_chars.append(last.value.as_mut().unwrap());
                let mut combined_indexes = entry.indexes;
                combined_indexes.append(&mut last.indexes);
                entries.push(Entry::new(Some(combined_chars), combined_indexes));
                entries.retain(|entry| !entry.indexes.is_empty())
            } else {
                entries.push(entry);
            }
        } else {
            entries.push(entry);
        }
    });

    let mut sum = 0;

    pointer_entries.into_iter().for_each(|pointer_entry| {
        let contact_numbers: Vec<_> = entries
            .iter()
            .filter(|entry| {
                entry.indexes.iter().any(|idx| {
                    let pointer_idx = pointer_entry.indexes[0];

                    let (row_pointer_entry, column_pointer_entry) = get_coords(&pointer_idx, &rows);
                    let (row_current_entry, column_current_entry) = get_coords(idx, &rows);

                    row_current_entry.abs_diff(row_pointer_entry) <= 1
                        && column_current_entry.abs_diff(column_pointer_entry) <= 1
                })
            })
            .collect();
        if contact_numbers.len() == 2 {
            let num = contact_numbers
                .iter()
                .map(digits_chars_to_number)
                .product::<u32>();
            sum += num;
        }
    });
    println!("{}", sum);
    Ok(())
}
