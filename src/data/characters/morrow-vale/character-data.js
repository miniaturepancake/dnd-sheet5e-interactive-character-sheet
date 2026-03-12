(window.CHARACTER_BUNDLES=window.CHARACTER_BUNDLES||{});
(window.CHARACTER_BUNDLES['morrow-vale']=window.CHARACTER_BUNDLES['morrow-vale']||{id:'morrow-vale',storageKeySeed:'morrow-vale',storageKey:'morrow-vale-sheet-v1',legacyStorageKeys:['placeholder-adept-sheet-v1']}).data = {
	"identity": {
		"name": "Morrow Vale",
		"species": "Shadar-kai",
		"classLevel": "Bard 11",
		"subclass": "College of Spirits (UA 2025)",
		"background": "Cairn Surveyor (custom 2024-style)",
		"alignment": "Lawful Neutral (suggested)",
		"pb": "+4",
		"xp": "One-shot / not tracked",
		"languages": ["Common", "Elvish", "Dwarvish"],
		"size": "Medium",
		"speed": "30 ft.",
		"role": ["controller", "ritual support", "occult negotiator", "field historian"],
		"faction": "Candlekeep Field Office",
		"summary": "Morrow Vale is a Shadar-kai funerary surveyor and licensed exhumation witness who maps battlefields, plague trenches, and saint-roads for Candlekeep clients. Where Sable treats the dead as testimony, Morrow treats them as geography: every grave, cairn, and reliquary is part of a living map of old violence.",
		"session0": "Morrow Vale is a Shadar-kai occult surveyor hired to chart the spiritual fault lines of cursed estates, sealed roads, and battlefields where the dead do not stay put. He arrives with measuring chains, prayer chalk, a lacquered viol, and the professional calm of someone used to negotiating with things older than the local law.",
		"vibe": "Funeral cartographer and boundary-marker. Morrow feels more like a surveyor-priest with a field kit than a court bard or tavern performer.",
		"personality": [
			"Methodical, patient, and almost never hurried.",
			"Treats names, burial markers, and local superstitions as operational intelligence.",
			"Dislikes improvising when a map, ledger, or warding line would do.",
			"Can be unexpectedly gentle with the grieving and brutally formal with trespassers."
		],
		"backstory": "Morrow spent years attached to caravan courts and temple archivists, documenting mass graves, abandoned shrines, and roads that acquired reputations for haunting after war. Candlekeep values him because he can enter a cursed place, determine what happened there, and leave it charted well enough that the next investigator has a chance of surviving. Wisteria Vale interests him less as a mystery and more as a failure of recordkeeping on a civic scale."
	},
	"combat": {
		"baseAC": 14,
		"shieldAC": 19,
		"initiative": "+2",
		"hp": 74,
		"hitDice": "11d8",
		"passives": {"Perception": 18, "Investigation": 16, "Insight": 17}
	},
	"abilities": [
		{"name": "Strength", "abbr": "STR", "score": 10, "mod": "+0"},
		{"name": "Dexterity", "abbr": "DEX", "score": 14, "mod": "+2"},
		{"name": "Constitution", "abbr": "CON", "score": 16, "mod": "+3"},
		{"name": "Intelligence", "abbr": "INT", "score": 12, "mod": "+1"},
		{"name": "Wisdom", "abbr": "WIS", "score": 8, "mod": "-1"},
		{"name": "Charisma", "abbr": "CHA", "score": 20, "mod": "+5"}
	],
	"saves": [
		{"name": "Strength", "bonus": "+0", "notes": "—"},
		{"name": "Dexterity", "bonus": "+6", "notes": "Proficient"},
		{"name": "Constitution", "bonus": "+3", "notes": "Advantage on concentration saves from War Caster"},
		{"name": "Intelligence", "bonus": "+1", "notes": "—"},
		{"name": "Wisdom", "bonus": "-1", "notes": "—"},
		{"name": "Charisma", "bonus": "+9", "notes": "Proficient"}
	],
	"skills": [
		["Acrobatics", "+4", "Jack of All Trades"],
		["Animal Handling", "+1", "Jack of All Trades"],
		["Arcana", "+9", "Expertise"],
		["Athletics", "+2", "Jack of All Trades"],
		["Deception", "+7", "Jack of All Trades"],
		["History", "+9", "Expertise"],
		["Insight", "+5", "Proficient"],
		["Intimidation", "+7", "Jack of All Trades"],
		["Investigation", "+5", "Proficient"],
		["Medicine", "+1", "Jack of All Trades"],
		["Nature", "+3", "Jack of All Trades"],
		["Perception", "+5", "Proficient"],
		["Performance", "+13", "Expertise"],
		["Persuasion", "+9", "Proficient"],
		["Religion", "+3", "Jack of All Trades"],
		["Sleight of Hand", "+4", "Jack of All Trades"],
		["Stealth", "+4", "Jack of All Trades"],
		["Survival", "+1", "Jack of All Trades"]
	],
	"proficiencies": {
		"Armor": ["Light armor"],
		"Weapons": ["Simple weapons", "rapier", "light crossbow"],
		"Saving Throws": ["Dexterity", "Charisma"],
		"Skills": ["Arcana", "History", "Insight", "Investigation", "Perception", "Performance"],
		"Tools / sets": ["Cartographer’s Tools", "Calligrapher’s Supplies", "Gaming Set (Playing Cards)", "Musical Instruments: viol, bone flute"]
	},
	"features": {
		"Species features": [
			{"title": "Darkvision", "lines": ["You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light."]},
			{"title": "Fey Ancestry", "lines": ["You have Advantage on saving throws you make to avoid or end the Charmed condition on yourself."]},
			{"title": "Keen Senses", "lines": ["You have proficiency in Perception."]},
			{"title": "Necrotic Resistance", "lines": ["You have Resistance to Necrotic damage."]},
			{"title": "Trance", "lines": ["You do not need to sleep, magic cannot put you to sleep, and you complete a Long Rest in 4 hours of trancelike meditation.", "At the end of a trance, you can gain two weapon or tool proficiencies you lack until your next Long Rest."]},
			{"title": "Blessing of the Raven Queen", "lines": ["As a Bonus Action, teleport up to 30 feet to an unoccupied space you can see.", "Uses per Long Rest: 4.", "Starting at level 3, when you teleport this way, you also gain resistance to all damage until the start of your next turn."]}
		],
		"Origin feat": [
			{"title": "Magic Initiate (Wizard)", "lines": ["You learn two Wizard cantrips: Light and Ray of Frost.", "You always have Shield prepared.", "You can cast Shield once without a spell slot per Long Rest, and you can also cast it using your spell slots.", "You use Charisma as the spellcasting ability for these feat spells."]}
		],
		"Class features": [
			{"title": "Bardic Inspiration (d10)", "lines": ["As a Bonus Action, choose one creature within 60 feet who can see or hear you.", "That creature gains one Bardic Inspiration die.", "Within the next hour, when it fails a D20 Test, it can roll the die and add it to the d20, potentially turning failure into success.", "Uses: equal to your Charisma modifier (5); recover all on a Long Rest, and on a Short Rest after level 5."]},
			{"title": "Spellcasting", "lines": ["You prepare 16 Bard spells of level 1+.", "Spirit Guardians is always prepared from your subclass and does not count against that prepared total.", "You have Ritual Casting for Bard spells with the Ritual tag.", "Your spellcasting ability is Charisma."]},
			{"title": "Expertise", "lines": ["Double proficiency bonus with Arcana, History, and Performance."]},
			{"title": "Jack of All Trades", "lines": ["Add half your Proficiency Bonus to any ability check using a skill proficiency you lack and that does not already use your Proficiency Bonus."]},
			{"title": "Font of Inspiration", "lines": ["Recover Bardic Inspiration on a Short or Long Rest.", "You may also expend a spell slot with no action to regain one expended use of Bardic Inspiration."]},
			{"title": "Countercharm", "lines": ["If you or a creature within 30 feet fails a saving throw against an effect applying Charmed or Frightened, you can use your Reaction to cause the save to be rerolled with Advantage."]},
			{"title": "Magical Secrets", "lines": ["Whenever your Bard prepared-spell total increases, your new prepared spells may come from the Bard, Cleric, Druid, or Wizard spell lists.", "When you replace a prepared Bard spell, the replacement may also come from those lists.", "Those chosen spells count as Bard spells for you."]}
		],
		"Subclass features": [
			{"title": "Channeler", "lines": ["You learn Guidance.", "When you cast Guidance, its range is 60 feet.", "You gain Playing Cards and proficiency with them.", "You may use playing cards, a crystal, an orb, a candle, or an ink pen as a Bard spellcasting focus."]},
			{"title": "Spirits from Beyond", "lines": ["While holding a spellcasting focus, you can take a Bonus Action and expend one use of Bardic Inspiration.", "Roll your Bardic Inspiration die, then choose one creature you can see within 30 feet as the target.", "The spirit effect happens immediately.", "If the effect calls for a saving throw, the DC equals your Bard spell save DC."]},
			{"title": "Empowered Channeling — Power from Beyond", "lines": ["Once per turn, when you cast a Bard spell that deals damage or restores Hit Points, roll 1d6.", "Add the number rolled to one damage roll of the spell or to the spell’s total healing."]},
			{"title": "Empowered Channeling — Spiritual Manifestation", "lines": ["Spirit Guardians is always prepared.", "You can cast it once per Long Rest without a spell slot.", "When you cast it, you can modify it so that you and allies within the emanation have Half Cover.", "Once you modify the spell this way, you cannot do so again until a Short or Long Rest."]}
		]
	},
	"spirits": [
		{"roll": 1, "name": "Beloved", "effect": "Target regains HP equal to one Bardic Inspiration roll + your Charisma modifier."},
		{"roll": 2, "name": "Sharpshooter", "effect": "Target takes Force damage equal to one Bardic Inspiration roll + your Charisma modifier."},
		{"roll": 3, "name": "Avenger", "effect": "Until the end of your next turn, any creature that hits the target with a melee attack takes Force damage equal to one Bardic Inspiration roll."},
		{"roll": 4, "name": "Renegade", "effect": "Target can immediately take a Reaction to teleport up to 30 feet to an unoccupied space it can see."},
		{"roll": 5, "name": "Fortune Teller", "effect": "Target has Advantage on D20 Tests until the start of your next turn."},
		{"roll": 6, "name": "Wayfarer", "effect": "Target gains temporary HP equal to one Bardic Inspiration roll + your Bard level; while it has those temporary HP, its Speed increases by 10 feet."},
		{"roll": 7, "name": "Trickster", "effect": "Target makes a Wisdom save. Fail: target takes Psychic damage equal to two Bardic Inspiration rolls and is Charmed until the start of your next turn. Success: half damage only."},
		{"roll": 8, "name": "Shade", "effect": "Target becomes Invisible until the end of its next turn or until it attacks, deals damage, or casts a spell. When the invisibility ends, each creature in a 5-foot emanation from the target makes a Constitution save or takes Necrotic damage equal to two Bardic Inspiration rolls."},
		{"roll": 9, "name": "Arsonist", "effect": "Target makes a Dexterity save, taking Fire damage equal to four Bardic Inspiration rolls on a failure or half as much on a success."},
		{"roll": 10, "name": "Coward", "effect": "Target and each creature of your choice in a 30-foot emanation from the target make a Wisdom save or become Frightened until the start of your next turn. While Frightened this way, a creature’s Speed is halved and it can take either an action or a Bonus Action, not both."}
	],
	"spiritsNote": "At Bard 11, the Bardic Inspiration die is d10, so Spirits from Beyond currently only accesses results 1–10. Results 11 (Brute) and 12 (Controlled Channeling) do not come online until Bard 15, when Bardic Inspiration becomes a d12.",
	"attacks": [
		["Rapier", "+6", "1d8 + 2 piercing", "finesse"],
		["Dagger", "+6", "1d4 + 2 piercing", "finesse, light, thrown 20/60"],
		["Light Crossbow", "+6", "1d8 + 2 piercing", "loading, range 80/320, two-handed"],
		["Vicious Mockery", "DC 18 with viol / 17 without", "3d6 psychic", "target has disadvantage on next attack roll before end of next turn if it fails"],
		["Ray of Frost", "+10 with viol / +9 without", "3d8 cold", "target speed reduced by 10 feet until the start of your next turn"]
	],
	"spellcasting": {
		"ability": "Charisma",
		"saveDCBase": 17,
		"saveDCWithViol": 18,
		"attackBase": 9,
		"attackWithViol": 10,
		"ritual": "Yes",
		"focus": "viol, playing cards, crystal marker, lantern-lens, or funerary chalk"
	},
	"cantrips": {
		"Bard / subclass cantrips": [
			{"name": "Guidance", "tags": ["Subclass", "60 ft."]},
			{"name": "Minor Illusion", "tags": ["Bard"]},
			{"name": "Vicious Mockery", "tags": ["Bard"]},
			{"name": "Message", "tags": ["Bard"]},
			{"name": "Mage Hand", "tags": ["Bard"]}
		],
		"Origin feat cantrips": [
			{"name": "Light", "tags": ["Magic Initiate"]},
			{"name": "Ray of Frost", "tags": ["Magic Initiate"]}
		],
		"Item-granted cantrip": [
			{"name": "Shillelagh", "id": "shillelagh", "tags": ["Fochlucan Bandore", "Item cast", "1/dawn in source"]}
		]
	},
	"preparedSpells": {
		"1st level": [
			{"name": "Bane", "tags": ["Prepared Bard"]},
			{"name": "Healing Word", "tags": ["Prepared Bard"]},
			{"name": "Silent Image", "tags": ["Prepared Bard"]},
			{"name": "Dissonant Whispers", "tags": ["Prepared Bard"]}
		],
		"2nd level": [
			{"name": "Mirror Image", "tags": ["Prepared Bard"]},
			{"name": "Suggestion", "tags": ["Prepared Bard"]}
		],
		"3rd level": [
			{"name": "Dispel Magic", "tags": ["Prepared Bard"]},
			{"name": "Hypnotic Pattern", "tags": ["Prepared Bard"]},
			{"name": "Sending", "tags": ["Prepared Bard"]}
		],
		"4th level": [
			{"name": "Banishment", "tags": ["Prepared Bard"]},
			{"name": "Dimension Door", "tags": ["Prepared Bard"]},
			{"name": "Greater Invisibility", "tags": ["Prepared Bard"]},
			{"name": "Polymorph", "tags": ["Prepared Bard"]}
		],
		"5th level": [
			{"name": "Synaptic Static", "tags": ["Prepared Bard"]}
		],
		"6th level": [
			{"name": "Mass Suggestion", "tags": ["Prepared Bard"]},
			{"name": "Otto's Irresistible Dance", "tags": ["Prepared Bard"]}
		]
	},
	"specialSpells": {
		"Subclass spell": [
			{"name": "Spirit Guardians", "tags": ["Subclass", "Always prepared", "Free cast 1/LR", "Does not count against prepared total"]}
		],
		"Origin feat spell": [
			{"name": "Shield", "tags": ["Magic Initiate", "Always prepared", "Free cast 1/LR", "Castable with slots"]}
		],
		"Item-granted spells": {
			"1st level": [
				{"name": "Animal Friendship", "id": "animalFriendship", "tags": ["Fochlucan Bandore", "Item cast", "1/dawn in source"]},
				{"name": "Longstrider", "id": "longstrider", "tags": ["Fochlucan Bandore", "Item cast", "1/dawn in source"]},
				{"name": "Silent Image", "id": "silentImage", "tags": ["Fochlucan Bandore", "Item cast", "1/dawn in source"]},
				{"name": "Speak with Animals", "id": "speakWithAnimals", "tags": ["Fochlucan Bandore", "Item cast", "1/dawn in source"]}
			],
			"2nd level": [
				{"name": "Invisibility", "id": "invisibility", "tags": ["Fochlucan Bandore", "Item cast", "1/dawn in source"]},
				{"name": "Knock", "id": "knock", "tags": ["Fochlucan Bandore", "Item cast", "1/dawn in source"]}
			],
			"3rd level": [
				{"name": "Fly", "id": "fly", "tags": ["Fochlucan Bandore", "Item cast", "1/dawn in source"]}
			]
		}
	},
	"spellSlots": {"1": 4, "2": 3, "3": 3, "4": 3, "5": 2, "6": 1},
	"magicItems": [
		{
			"id": "viol",
			"name": "Graveglass Viol +1",
			"subtitle": "flavor reskin of Rhythm-Maker’s Drum +1; Uncommon, attunement by a Bard",
			"lines": [
				"This is mechanically a Rhythm-Maker’s Drum +1.",
				"Its lacquer is threaded with powdered graveglass that catches lamplight like frost.",
				"+1 to Bard spell attack rolls.",
				"+1 to save DCs of Bard spells.",
				"1/dawn: as an action, regain one use of Bardic Inspiration.",
				"Acquired at: Bard 5."
			]
		},
		{
			"id": "bandore",
			"name": "Hollowsong Bandore",
			"subtitle": "Instrument of the Bards; Uncommon, attunement by a Bard",
			"lines": [
				"You can use this instrument as a spellcasting focus for your Bard spells.",
				"Its frame is marked with survey sigils and cemetery district seals.",
				"You can use an action to play the instrument and cast one of its spells. Once it has cast a specific spell, it cannot cast that spell again until the next dawn.",
				"Morrow uses it for route-clearing magic, field concealment, and entry control rather than courtly performance.",
				"While you play it, you can impose disadvantage on saving throws against any Bard spell you cast that causes the Charmed condition on a failed save, provided the spell has a somatic or material component.",
				"Acquired at: Bard 10."
			]
		}
	],
	"attunement": [
		{"label": "Graveglass Viol +1", "key": "viol", "default": true},
		{"label": "Hollowsong Bandore", "key": "bandore", "default": false},
		{"label": "Third attunement slot occupied", "key": "thirdOccupied", "default": true}
	],
	"gear": [
		"Studded leather armor",
		"Rapier",
		"Dagger",
		"Light crossbow",
		"20 bolts",
		"Graveglass Viol +1",
		"Hollowsong Bandore",
		"Surveyor’s chains and chalk",
		"Lantern with smoked panes",
		"Cartographer’s tools",
		"Field ledger of burial plots",
		"Waxed grave-rubbings portfolio"
	],
	"purchasePlan": [
		["Potion of Healing", 4, "50 gp", "200 gp"],
		["Healer’s Kit", 2, "5 gp", "10 gp"],
		["Crowbar", 1, "2 gp", "2 gp"],
		["Climber’s Kit", 1, "25 gp", "25 gp"],
		["Disguise Kit", 1, "25 gp", "25 gp"],
		["Antitoxin", 2, "50 gp", "100 gp"],
		["Holy Water", 2, "25 gp", "50 gp"],
		["Bell", 2, "1 gp", "2 gp"],
		["Lantern, Hooded", 1, "5 gp", "5 gp"],
		["Oil (flasks)", 10, "1 sp", "1 gp"],
		["Silk Rope (50 ft.)", 1, "10 gp", "10 gp"],
		["Steel Mirror", 1, "5 gp", "5 gp"],
		["Total", "", "", "435 gp"]
	],
	"remainingCoin": "65 gp remaining",
	"tacticalNotes": [
		"Open with Bane or Hypnotic Pattern when a fight needs to be measured rather than rushed.",
		"Use Silent Image, Invisibility, Knock, and Sending to treat dungeons like logistics problems.",
		"Morrow likes to hold Spirit Guardians until terrain is already constrained or an exit must be denied.",
		"Ray of Frost is a useful tempo cantrip when movement control matters more than raw damage.",
		"Use Blessing of the Raven Queen for line correction, not flair: break sight lines, cross hazards, keep concentration.",
		"The bandore spell list is configured for travel, infiltration, and controlled entry rather than raw blasting.",
		"Mass Suggestion is for ending a problem before initiative becomes necessary.",
		"Polymorph remains the emergency answer when someone absolutely must survive the next minute."
	]
};