enum Flow {
    Good = -1, Continue = 0, Bad = 1
}

type PacketValue = number | Packet;
type Packet = Array<PacketValue>;
type PacketPair = [left: Packet, right: Packet];

const bothNumbers = (left: PacketValue, right: PacketValue): boolean => [typeof left, typeof right].every(type => type === "number");
const convertToPacket = (value: PacketValue): Packet => typeof value === "number" ? [value] : value;

const comparePacketPair = (left: Packet, right: Packet): Flow => {
    for (const [index, leftValue] of left.entries()) {
        const rightValue = right[index];
        if (rightValue === undefined) return Flow.Bad;
        if (bothNumbers(leftValue, rightValue)) {
            if (leftValue === rightValue) continue;
            return leftValue < rightValue ? Flow.Good : Flow.Bad;
        }
        const comparison = comparePacketPair(convertToPacket(leftValue), convertToPacket(rightValue));
        if (comparison != Flow.Continue) return comparison;
    }
    return left.length < right.length ? Flow.Good : Flow.Continue;
};

const dataString = await Deno.readTextFile("./puzzle_input.txt");

const pairs = dataString
    .split("\n\n")
    .map(pairs => pairs
        .split("\n")
        .map(line => JSON.parse(line) as Packet) as PacketPair);

// Part 1
const counters: Map<number, Flow> = new Map();
for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const test = comparePacketPair(pair[0], pair[1]);
    counters.set(i + 1, test);
}
console.log("Part 1:" + Array.from(counters.entries()).filter(entry => entry[1] == Flow.Good).map(entry => entry[0]).reduce((acc, v) => acc + v));

// Part 2
const firstDivider = [[2]] as Packet;
const secondDivider = [[6]] as Packet;
const packets = pairs.reduce((packets, [left, right]) => [...packets, left, right], [firstDivider, secondDivider] as Packet[]).sort((...packets) => comparePacketPair(...packets));
console.log("Part 2:" + [packets.indexOf(firstDivider) + 1, packets.indexOf(secondDivider) + 1].reduce((acc, v) => acc * v));


