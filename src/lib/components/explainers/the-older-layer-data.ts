export interface DigLine {
	t: string;
	notes: (string | null)[];
	later?: boolean;
	older?: boolean;
}

export const GILG: DigLine[] = [
	{
		t: 'Tablet I. Gilgamesh, king of Uruk, oppresses his people. The gods create Enkidu to match him.',
		notes: [
			null,
			'The standard version opens by praising the king as one who saw the deep and came back wise. An earlier Babylonian version opened by simply calling him the greatest of kings. Somebody rewrote the first line to be about knowledge rather than status.',
			'Behind both sit five separate Sumerian poems about a king called Bilgames, circulating some three centuries earlier and never as one story.'
		]
	},
	{
		t: 'Tablets II to VI. The two become friends, kill the forest guardian Humbaba, and refuse the goddess Ishtar.',
		notes: [null, null, 'The Humbaba expedition exists as its own Sumerian poem, complete in itself and with a different ending.']
	},
	{
		t: 'Tablets VII and VIII. Enkidu sickens and dies. Gilgamesh will not leave the body.',
		notes: [null, null, null]
	},
	{
		t: 'Tablets IX to X. Gilgamesh goes looking for the one man who never died.',
		notes: [null, null, null]
	},
	{
		t: 'Tablet XI. Utnapishtim describes the flood: the boat, the animals, the birds sent out to find land, the sacrifice afterwards.',
		later: true,
		notes: [
			null,
			'This is a separate composition. Nearly all of it corresponds to a Babylonian poem about a man called Atrahasis, which exists on its own tablets and is not about Gilgamesh at all.',
			'So the most famous passage in the epic is an insertion, and it was already old when it was inserted.'
		]
	},
	{
		t: 'Tablet XII. Enkidu goes down to the underworld and describes what he finds there.',
		later: true,
		notes: [
			null,
			'Enkidu died four tablets ago and is alive again here, with no explanation offered.',
			'Because tablet XII is a partial translation of one of the old Sumerian poems, appended to the end without being fitted to the story. The seam is not a theory. It is a contradiction sitting in the text.'
		]
	}
];

export const DEUT: DigLine[] = [
	{
		t: 'When the Most High divided up the nations and separated humankind, he fixed the boundaries of the peoples.',
		notes: [null, 'Uncontroversial, and identical in every manuscript.', null]
	},
	{
		t: 'He fixed them according to the number of the sons of Israel.',
		later: true,
		notes: [
			null,
			'This is the reading in the medieval Hebrew manuscripts that most translations follow.',
			'It is also slightly odd: the number of the sons of Israel has nothing obvious to do with the number of nations.'
		]
	},
	{
		t: 'He fixed them according to the number of the sons of God.',
		older: true,
		notes: [
			null,
			'This is the reading in a Dead Sea Scrolls fragment of Deuteronomy, and it agrees with the ancient Greek translation, which has divine beings here rather than Israelites. Two independent witnesses, both older than the manuscripts behind the other version.',
			'Read this way, the nations are distributed among divine beings, one each.'
		]
	},
	{
		t: "For the LORD's own portion is his people, and Jacob is his allotted share.",
		notes: [
			null,
			'Unchanged in all versions, and this is the line that makes the passage interesting.',
			'With the older reading above it, the sense is that the Most High allots the nations among divine beings, and the one who receives Israel is Yahweh. The passage describes an assembly of gods with a portion each, and the God of Israel receiving his.'
		]
	}
];

export const SKY: [string, string, string][] = [
	['Vedic Sanskrit', 'Dyáuṣ Pitā́', 'sky father'],
	['Greek', 'Zeù Páter', 'father Zeus'],
	['Latin', 'Iūpiter', 'from an older Diēspiter'],
	['Umbrian', 'Iupater', ''],
	['Illyrian', 'Dei-pátrous', '']
];
