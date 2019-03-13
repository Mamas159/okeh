/**
 * Special thanks to github user 'Iwasawafag'
 * for both showing me proper use of the Jimp npm package
 * and teaching me a lot about promises while writing the code below.
 * https://github.com/oliver-moran/jimp/issues/284
 */

const Jimp = require('jimp');

// font will be absolutely needed, so loading it at the boot time
const fontSmallLoadPromise = Jimp.loadFont(Jimp.FONT_SANS_16_WHITE); 
const fontLoadPromise = Jimp.loadFont(Jimp.FONT_SANS_32_WHITE); 
const fontBigLoadPromise = Jimp.loadFont(Jimp.FONT_SANS_64_WHITE); 

// Base image is always the same, so makes sense to load it once and cache it in memory
const baseWelcomeImagePromise = Jimp.read("./img/main.jpg");
const baseShipImagePromise = Jimp.read("./img/wedding-main.jpg");
const baseLubImagePromise = Jimp.read("./img/lub.png");

// Caching all profile bases, this is unfortunatly long af.
const profile1 = Jimp.read("./img/Profile_1.png");
const profile2 = Jimp.read("./img/Profile_2.png");
const profile3 = Jimp.read("./img/Profile_3.png");
const profile4 = Jimp.read("./img/Profile_4.png");
const profile5 = Jimp.read("./img/Profile_5.png");
const profile6 = Jimp.read("./img/Profile_6.png");
const profile7 = Jimp.read("./img/Profile_7.png");
const profile8 = Jimp.read("./img/Profile_8.png");
const profile9 = Jimp.read("./img/Profile_9.png");
const profile10 = Jimp.read("./img/Profile_10.png");
const profile11 = Jimp.read("./img/Profile_11.png");
const profile12 = Jimp.read("./img/Profile_12.png");
const profile13 = Jimp.read("./img/Profile_13.png");
const profile14 = Jimp.read("./img/Profile_14.png");
const profile15 = Jimp.read("./img/Profile_15.png");
const profile16 = Jimp.read("./img/Profile_16.png");
const profile17 = Jimp.read("./img/Profile_17.png");
const profile18 = Jimp.read("./img/Profile_18.png");
const profile19 = Jimp.read("./img/Profile_19.png");
const profile20 = Jimp.read("./img/Profile_20.png");
const profile21 = Jimp.read("./img/Profile_21.png");
const profile22 = Jimp.read("./img/Profile_22.png");
const profile23 = Jimp.read("./img/Profile_23.png");
const profile24 = Jimp.read("./img/Profile_24.png");
const profile25 = Jimp.read("./img/Profile_25.png");
const profile26 = Jimp.read("./img/Profile_26.png");
const profile27 = Jimp.read("./img/Profile_27.png");
const profile28 = Jimp.read("./img/Profile_28.png");
const profile29 = Jimp.read("./img/Profile_29.png");
const profile30 = Jimp.read("./img/Profile_30.png");
const profile31 = Jimp.read("./img/Profile_31.png");
const profile32 = Jimp.read("./img/Profile_32.png");
const profile33 = Jimp.read("./img/Profile_33.png");
const profile34 = Jimp.read("./img/Profile_34.png");
const profile35 = Jimp.read("./img/Profile_35.png");
const profile36 = Jimp.read("./img/Profile_36.png");
const profile37 = Jimp.read("./img/Profile_37.png");
const profile38 = Jimp.read("./img/Profile_38.png");
const profile39 = Jimp.read("./img/Profile_39.png");
const profile40 = Jimp.read("./img/Profile_40.png");
const profile41 = Jimp.read("./img/Profile_41.png");
const profile42 = Jimp.read("./img/Profile_42.png");
const profile43 = Jimp.read("./img/Profile_43.png");
const profile44 = Jimp.read("./img/Profile_44.png");
const profile45 = Jimp.read("./img/Profile_45.png");
const profile46 = Jimp.read("./img/Profile_46.png");
const profile47 = Jimp.read("./img/Profile_47.png");
const profile48 = Jimp.read("./img/Profile_48.png");
const profile49 = Jimp.read("./img/Profile_49.png");
const profile50 = Jimp.read("./img/Profile_50.png");
const profile51 = Jimp.read("./img/Profile_51.png");
const profile52 = Jimp.read("./img/Profile_52.png");
const profile53 = Jimp.read("./img/Profile_53.png");
const profile54 = Jimp.read("./img/Profile_54.png");
const profile55 = Jimp.read("./img/Profile_55.png");
const profile56 = Jimp.read("./img/Profile_56.png");

function baseProfilePromise(nProfile) {
	switch(nProfile) {
		case 1:
			return profile1;
		case 2:
			return profile2;
		case 3:
			return profile3;
		case 4:
			return profile4;
		case 5:
			return profile5;
		case 6:
			return profile6;
		case 7:
			return profile7;
		case 8:
			return profile8;
		case 9:
			return profile9;
		case 10:
			return profile10;
		case 11:
			return profile11;
		case 12:
			return profile12;
		case 13:
			return profile13;
		case 14:
			return profile14;
		case 15:
			return profile15;
		case 16:
			return profile16;
		case 17:
			return profile17;
		case 18:
			return profile18;
		case 19:
			return profile19;
		case 20:
			return profile20;
		case 21:
			return profile21;
		case 22:
			return profile22;
		case 23:
			return profile23;
		case 24:
			return profile24;
		case 25:
			return profile25;
		case 26:
			return profile26;
		case 27:
			return profile27;
		case 28:
			return profile28;
		case 29:
			return profile29;
		case 30:
			return profile30;
		case 31:
			return profile31;
		case 32:
			return profile32;
		case 33:
			return profile33;
		case 34:
			return profile34;
		case 35:
			return profile35;
		case 36:
			return profile36;
		case 37:
			return profile37;
		case 38:
			return profile38;
		case 39:
			return profile39;
		case 40:
			return profile40;
		case 41:
			return profile41;
		case 42:
			return profile42;
		case 43:
			return profile43;
		case 44:
			return profile44;
		case 45:
			return profile45;
		case 46:
			return profile46;
		case 47:
			return profile47;
		case 48:
			return profile48;
		case 49:
			return profile49;
		case 50:
			return profile50;
		case 51:
			return profile51;
		case 52:
			return profile52;
		case 53:
			return profile53;
		case 54:
			return profile54;
		case 55:
			return profile55;
		case 56:
			return profile56;
		default:
			return profile1;
	}
}

function getProfileColor(nProfile) {
	switch(nProfile) {
		case 0:
			return 0xBD8B17FF;
		default:
			return 0xBD8B17FF;
	}
}

//Exp bar base is always the same
const promiseExperienceBarFrame = new Jimp(500, 40, 0xFFFFFFFF);
const promiseExperienceBarFiller = new Jimp(494, 34, 0x000000F0);

// Jimp#getBuffer still doesn't return promise, this method helps us
function encodeJimpImage(image, mime) {
    return new Promise(function (fulfil, reject) {
       image.getBuffer(mime, function (err, data) {
           if (err) reject(err);
           fulfil(data);
       });
    });
}

exports.createWelcomeImage = function(sGuildName, sUserName, sUserImageURL) {
    return Promise
        .all([
            Jimp.read(sUserImageURL),
            baseWelcomeImagePromise,
            fontLoadPromise
        ])
        .then(function (results) {
            let avatar = results[0];
            const baseImage = results[1];
            const font = results[2];
			
			avatar.resize(138, 138);
			
			let title = "Welcome to " + sGuildName + "~!";
			let width_title = measureText(font, title);
			let width_username = measureText(font, sUserName);
            
            return baseImage
                .clone() // making a copy of Jimp image so we don't modify the original
                .print(font, 250-(width_title/2), 220, title)
				.print(font, 250-(width_username/2), 265, sUserName)
                .composite(avatar, 250-(138/2), 65);        
        })
        .then(compositedImage => encodeJimpImage(compositedImage, Jimp.MIME_PNG))
};

exports.createShip = function(bride, groom) {
    return Promise
        .all([
            Jimp.read(bride.avatarURL),
			Jimp.read(groom.avatarURL),
			baseLubImagePromise,
            baseShipImagePromise,
			fontBigLoadPromise
        ])
        .then(function (results) {
            let brideAvatar = results[0];
			let groomAvatar = results[1];
			let lubImg = results[2];
            const baseImage = results[3];
			const fontBig = results[4];
			
			brideAvatar.resize(138, 138);
			groomAvatar.resize(138, 138);
			
			const center_left = (395/2)-(138/2);
			const center_right = 790-(790/4)-(138/2);
			const center_top = (444/2)-(138/2)
            
            return baseImage
                .clone() // making a copy of Jimp image so we don't modify the original
                .print(fontBig, 145, 325, "Lovely shipping~!")
                .composite(brideAvatar, center_left, center_top)
				.composite(groomAvatar, center_right, center_top)
				.composite(lubImg, (790/2)-(138/2), center_top);
        })
        .then(compositedImage => encodeJimpImage(compositedImage, Jimp.MIME_PNG))
};

exports.createProfile = function(sUserName, sAvatarURL, nLevel, nExp, nCuteness, nGameScore, nCash, sStatus, nNextLevelExp, sExpProgress, sRoles, nProfile) {
	return Promise
        .all([
            Jimp.read(sAvatarURL),
			baseProfilePromise(nProfile),
			fontLoadPromise,
			fontBigLoadPromise,
			fontSmallLoadPromise,
			promiseExpBar(nExp, nNextLevelExp)
        ])
        .then(function (results) {
            let userAvatar = results[0];
			let baseImage = results[1];
			const font = results[2];
            const fontBig = results[3];
			const fontSmall = results[4];
			const expBar = results[5];
			
			userAvatar.resize(180, 180);
			
			const avatarX = 100;
			const avatarY = 11;
			
			let sWallet = "Cash: £" + nCash;
			let sSplit = "_____________";
            
            let image = baseImage
                .clone()
                .composite(userAvatar, avatarX, avatarY)
				.composite(baseImage, 0, 0)
                .print(fontBig, 500 - (measureText(fontBig, sUserName) / 2), 35, sUserName)
				.print(fontBig, 300, 50, sSplit)
				.print(font, 500 - (measureText(font, sRoles) / 2), 130, sRoles)
				.composite(expBar, 150, 250)
				.print(fontSmall, 400 - (measureText(fontSmall, sExpProgress) / 2), 260, sExpProgress)
				.print(font, 150, 300, "Level: " + nLevel)
				.print(font, 650 - measureText(font, sWallet), 300, sWallet)
				.print(font, 150, 332, "Cuteness: " + nCuteness)
				.print(font, 150, 364, "Gamescore: " + nGameScore)
				.print(fontBig, 400 - (measureText(fontBig, sSplit) / 2)-10, 360, sSplit);
			
			let aStatus = sStatus.match(/.{1,32}/g);
			for (let i = 0; i < 3 && i < aStatus.length; i++) {
				image.print(font, 150, 445 + (32 * i), aStatus[i]);
			}
			
			return image;
        })
        .then(compositedImage => encodeJimpImage(compositedImage, Jimp.MIME_PNG))
}

function promiseExpBar(nExp, nNextLevelExp, nProfile) {
	return Promise
        .all([
            promiseExperienceBarFrame,
			promiseExperienceBarFiller,
			promiseExperienceBarProgress((nExp / nNextLevelExp) * 100, nProfile)
        ])
        .then(function (results) {
            let frame = results[0];
			let filler = results[1];
			let progress = results[2];
			
            return frame
                .composite(filler, 3, 3)
				.composite(progress, 3, 3);
        })
}

function promiseExperienceBarProgress(nProgress, nProfile) {
	return new Promise(function (resolve, reject) {
       let bar = new Jimp(494 - (494 - Math.floor((496 / 100) * nProgress)), 34, getProfileColor(nProfile), function (err, image) {
			if (err) reject(err);
			resolve(image);
		});
    });
}

function measureText(font, text) {
    var x = 0;
    for (var i = 0; i < text.length; i++) {
        if (font.chars[text[i]]) {
            x += font.chars[text[i]].xoffset
                + (font.kernings[text[i]] && font.kernings[text[i]][text[i + 1]] ? font.kernings[text[i]][text[i + 1]] : 0)
                + (font.chars[text[i]].xadvance || 0);
        }
    }
    return x;
};