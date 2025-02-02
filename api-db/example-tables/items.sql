CREATE TABLE items (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(250) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,

    PRIMARY KEY (id)
);

/****************************************************************
    * 
    *  INSERT INTO items
    * 
****************************************************************/

/*********************************
    *  GUITARS
*********************************/

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("PRS SE P20 Parlour VM", 50.79, "../media/categories/guitar/guitar-1.jpg", "prs-p20-guitar", "Acoustic Guitar Steel String Pack Bundle for Beginners - 6 Months FREE Lessons, Bag, Picks and Spare Strings", "guitar");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Marin Smith Acoustic Guitar Kit", 80.00, "../media/categories/guitar/guitar-2.jpg", "martin-smith-guitar", "Classical Junior Acoustic Guitar For Kids", "guitar");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Music Alley MA-51 Classical Acoustic Guitar", 26.99, "../media/categories/guitar/guitar-3.jpg", "ma-51-guitar", "Full Size Steel String Acoustic Guitar Traditional Western Body", "guitar");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("RockJam Full Size Electric Guitar Kit", 129.99, "../media/categories/guitar/guitar-4.jpg", "rock-jam-guitar", "1/2 Size Kids Rock Electric Guitar Pack for Junior Beginners", "guitar");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Donner Acoustic Guitar 4/4 Dreadnought", 119.98, "../media/categories/guitar/guitar-5.jpg", "donner-dreadnought-guitar", "1 inch Guitar Kit for Beginner with Gig Bag Capo Picks Tuner Strap Strings", "guitar");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Yamaha F370 Full Size Steel String Acoustic Guitar", 159.00, "../media/categories/guitar/guitar-6.jpg", "yamaha-f370-guitar", "F310 Acoustic Folk Guitar with Strap / Tuner / Strings / 3 Picks / String Winder", "guitar");

/*********************************
    *  Drums
*********************************/

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Alesis Drums Nitro Mesh Kit", 355.00, "../media/categories/drums/drums-1.jpg", "alesis-drums-kit", "Electric Drum Set with Mesh Drum Pads, Drum Sticks, 385 Drum Kit Sounds, 60 Play-Along Tracks and USB MIDI Connectivity", "drums");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Music Alley Junior", 95.00, "../media/categories/drums/drums-2.jpg", "alley-junior", "Drum Kit for Kids with Kick Drum Pedal, Drum Stool & Drum Sticks - Blue", "drums");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Shayson Kids Drum Kit", 36.99, "../media/categories/drums/drums-3.jpg", "shayson-drum-kit", "Drum Set for Toddler, Beginner Kids Musical Instrument, Jazz Drum Play Set Musical Toy Fit for 1 2 3 years old Boys and Girls", "drums");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Music Alley Junior", 87.47, "../media/categories/drums/drums-4.jpg", "music-alley-junior", "Drum Kit for Kids with Kick Drum Pedal, Drum Stool & Drum Sticks - Black", "drums");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Carlsbro Rock 50 Electric", 144.98, "../media/categories/drums/drums-5.jpg", "calrsbro-rock-50", "Drum Kit Electronic Digital Set with Stool and Headphones Junior Beginner Silent Quiet Childrens Kids Practice Kit", "drums");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("GYMAX Kids Drum Kit", 98.95, "../media/categories/drums/drums-6.jpg", "gymax-kids-drums" , "3 Pieces Children Junior Drum Set with Stool and Sticks, Beginner Rock Drum Set for Boys & Girls (Black)", "drums");

/*********************************
    *  Pianos
*********************************/

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Yamaha PSR-F52 Digital Keyboard", 79.00, "../media/categories/piano/piano-1.jpg", "yamaha-psr-f52", "black - Compact digital keyboard for beginners with 61 keys, 144 instrument voices and 158 accompaniment styles", "piano");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Max KB4 Full Size Electronic Keyboard", 99.99, "../media/categories/piano/piano-2.jpg", "max-kb4-keyboard", "61 Key Digital Piano Organ with Stand Musical Instrument Set", "piano");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("YAMAHA P-45B Digital Piano", 359.00, "../media/categories/piano/piano-3.jpg", "yamaha-p-45b", "Light and Portable Piano for Hobbyists and Beginners, in Black", "piano");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("MAX KB1 61 Key Keyboard Piano", 75.00, "../media/categories/piano/piano-4.jpg", "max-kb1-61", "Full Size with Sheet Music Stand Record Function Battery or Power Supply Works with Simply Piano Application", "piano");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("61-Key Piano Keyboard", 52.49, "../media/categories/piano/piano-5.jpg", "61-key-piano", "Electronic Piano With Digital Screen 16 Tones&Recording/Programming,Multifunction Digital Electric Piano Keyboard,Portable Musical Instrument With Microphone For Music Lover", "piano");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Finding Good Electronic Piano", 24.97, "../media/categories/piano/piano-6.jpg", "finding-electronic", "Keyboard for Kids 37 Keys, Musical Toys Portable Mini 3 4 5 6 Years Old Beginner Boys Girls, Sensory Instruments Birthday Gifts Age 3-6- Black", "piano");

/*********************************
    *  Studio
*********************************/

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("24 Pack Pro-coustix", 24.99, "../media/categories/studio/studio-1.jpg", "24-pack-pro", "Uncompressed high Density Echostop Acoustic Foam Panels, Studio Panels Acoustic Foam Tiles. These are for improving Sound Quality in Studios NOT Sound proofing", "studio");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Shure SM8B Vocal Dynamic", 347.00, "../media/categories/studio/studio-2.jpg", "shure-sm7b-vocal", "Microphone for Broadcast, Podcast & Recording, XLR Studio Mic for Music & Speech, Wide-Range Frequency, Warm & Smooth Sound, Rugged Construction, Detachable Windscreen - Black", "studio");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("TC Helicon GoXLR", 375.00, "../media/categories/studio/studio-3.jpg", "tc-helicon-goxlr", "Revolutionary Online Broadcaster Platform with 4-Channel Mixer, Motorized Faders, Sound Board and Vocal Effects, PC Compatible Only", "studio");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Elgato Wave XLR", 144.98, "../media/categories/studio/studio-4.jpg", "elgato-wave-xlr", "Audio Mixer and 75 db Preamp for XLR Mic to USB-C, Control Interface with 48V Phantom Power", "studio");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("TC Helicon GoXLR MIC-WH", 116.68, "../media/categories/studio/studio-5.jpg", "tc-helicon-mic-wh", "Dynamic Broadcast Microphone with Integrated Pop Filter", "studio");

INSERT INTO items (name, price, image_url, slug, description, type) 
VALUES("Cloudlifter, CL-1", 355.00, "../media/categories/studio/studio-6.jpg", "cloudlifter-cl-1", "Microphone Amplifier", "studio");