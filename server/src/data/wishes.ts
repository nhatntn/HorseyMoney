/**
 * Lời chúc theo nhóm tuổi (tuổi tính theo năm, biên trên inclusive):
 * - 0–6, 7–12, 13–16, 17–18, 19–22, 23–30, 31–40, 40+
 */

export const DEFAULT_AGE_GROUP = "22_30" as const;

/** Giá trị dùng trong DB cho lời chúc áp dụng mọi lứa tuổi. */
export const AGE_GROUP_ALL = "all" as const;

export type AgeGroup =
  | "0_6"
  | "6_12"
  | "12_16"
  | "16_18"
  | "18_22"
  | "22_30"
  | "30_40"
  | "40_plus";

export const wishesByAge: Record<AgeGroup, string[]> = {
  "0_6": [
    "Chúc bé năm mới khỏe mạnh 💪, ăn ngoan 🍚, ngủ kỹ 😴 và lớn nhanh như thổi 📏!",
    "Năm mới chúc em lúc nào cũng cười tít mắt 😄, được thật nhiều quà 🎁 và lì xì đầy tay 💰!",
    "Chúc bé cả năm không ốm đau ❤️, chạy nhảy thật vui 🏃‍♂️ và được ba mẹ ôm thật nhiều 🤗!",
    "Năm mới chúc em khám phá được thật nhiều điều mới lạ 🔍 và ngày nào cũng vui như hội 🎉!",
    "Chúc bé cao thêm một khúc 📏, thông minh thêm vài phần 🧠 và đáng yêu gấp mười lần 💖!",
    "Năm mới chúc em ăn gì cũng ngon 😋, chơi gì cũng vui 🧸 và không bao giờ bị la 😉!",
    "Chúc bé ngủ ngon mơ đẹp 🌙, mơ toàn chuyện cổ tích 🏰 và sáng dậy cười thật tươi ☀️!",
    "Năm mới chúc em chạy thật nhanh 🐰, nói thật sõi 🗣️ và hát thật hay 🎵!",
    "Chúc bé luôn hồn nhiên 😊, vui vẻ mỗi ngày 🌈 và mang tiếng cười đến cho cả nhà 😄!",
    "Năm mới chúc em khỏe như siêu nhân 🦸‍♂️ và đáng yêu như thiên thần 👼!",
    "Chúc bé mở lì xì lần nào cũng thấy vui 🎊 và ôm lì xì mà không chịu buông 💌!",
    "Năm mới chúc em có thật nhiều bạn nhỏ 👶, chơi đâu cũng vui 🧩!",
    "Chúc bé năm nay nói nhanh hơn 🗣️, chạy nhanh hơn 🏃‍♀️ và cười nhiều hơn 😄!",
    "Năm mới chúc em lúc nào cũng được yêu thương ❤️ và ôm thật nhiều mỗi ngày 🤗!",
    "Chúc bé ăn ngoan chóng lớn 🍎, học điều hay 🧠 và được khen thật nhiều 👍!",
    "Năm mới chúc em không khóc nhè 😆, không nhõng nhẽo mà luôn tươi cười 😊!",
    "Chúc bé mỗi ngày đều có điều thú vị để khám phá 🔎 và niềm vui nhỏ xinh 🌟!",
    "Năm mới chúc em khỏe như voi con 🐘, nhanh như thỏ nhỏ 🐇 và sáng như mặt trời ☀️!",
    "Chúc bé luôn được ông bà, ba mẹ thương yêu hết mực ❤️ và chăm sóc từng chút một 🤱!",
    "Năm mới chúc em lớn lên hạnh phúc 🌸, bình an 🕊️ và ngập tràn tiếng cười 😄!"
  ],

  "6_12": [
    "Năm mới chúc em thêm tuổi luôn chăm ngoan 🎒, học giỏi 📚 và nghe lời ba mẹ ❤️.",
    "Tết đến chúc em nhận thật nhiều lì xì 💰, bánh kẹo đầy nhà 🍬 và tiếng cười thật to 😄.",
    "Chúc em năm mới khỏe mạnh 💪, ăn ngon 🍚 và lớn nhanh như thổi 📏.",
    "Năm mới mong em đi học vui vẻ 🎒, kết thêm nhiều bạn tốt 🤗 và có thật nhiều kỷ niệm đẹp 📸.",
    "Chúc em học bài nhanh hiểu 📖, làm toán thật giỏi ➕ và viết chữ thật đẹp ✍️.",
    "Tết này mong em luôn cười tươi 😊, chơi ngoan 🧸 và biết giúp đỡ mọi người 🤝.",
    "Năm mới chúc em cao thêm vài centimet 📏 và thông minh hơn mỗi ngày 🧠.",
    "Chúc em luôn lễ phép 👋, kính trọng thầy cô 👩‍🏫 và yêu thương gia đình ❤️.",
    "Năm mới mong em có thật nhiều điều thú vị để khám phá 🔍 và học thêm nhiều kiến thức mới 📚.",
    "Tết đến chúc em chơi vui nhưng vẫn nhớ làm bài đầy đủ nhé 😉📖.",
    "Chúc em mỗi ngày đến trường đều thật hào hứng 🎉 và tràn đầy năng lượng ☀️.",
    "Năm mới mong em dũng cảm hơn 🦁, tự tin phát biểu trong lớp 🎤.",
    "Chúc em luôn giữ được sự hồn nhiên 😊 và trái tim trong sáng 💖.",
    "Tết này mong em có thật nhiều đồ chơi mới 🧩 và những buổi đi chơi thật vui 🎡.",
    "Năm mới chúc em chăm chỉ hơn một chút 📚 và giỏi hơn thật nhiều 💯.",
    "Chúc em luôn biết chia sẻ 🫶, yêu thương bạn bè 🤗 và sống thật tử tế 💎.",
    "Năm mới mong em mỗi ngày đều học được điều hay 🌟 và làm được việc tốt 👍.",
    "Tết đến chúc em đạt nhiều điểm 10 đỏ chót 🏆 và được thầy cô khen nhiều hơn 🎉.",
    "Chúc em luôn mạnh dạn thử điều mới 💡 và không sợ sai khi học tập 📝.",
    "Năm mới chúc em có một tuổi thơ thật đẹp 🌈, thật vui và đầy ắp tiếng cười 😄."
  ],

  "12_16": [
    "Năm mới chúc em tuổi mới học hành tiến bộ 📚, điểm số tăng đều 💯 và luôn tự tin trong lớp học 🎯.",
    "Tết đến chúc em lì xì đầy túi 💰, niềm vui đầy tim ❤️ và tiếng cười mỗi ngày 😄.",
    "Chúc em luôn chăm ngoan 🧠, lễ phép 🤝 và ngày càng trưởng thành hơn 🌱.",
    "Năm mới mong em khỏe mạnh 💪, ăn ngon ngủ kỹ 😴 và tràn đầy năng lượng ☀️.",
    "Chúc em thi đâu trúng đó 📝, kiểm tra đâu điểm cao đó 🏆.",
    "Tết này mong em học nhanh hiểu bài 📖, làm bài chính xác ✔️ và tự tin phát biểu 🎤.",
    "Năm mới chúc em giữ được sự hồn nhiên 😊 và thêm thật nhiều ước mơ đẹp 🌈.",
    "Chúc em luôn vui vẻ 😎, kết bạn thật nhiều 🤗 và có những kỷ niệm đáng nhớ 📸.",
    "Năm mới mong em bớt lười một chút 😆, chăm chỉ hơn một chút 📚 và giỏi hơn rất nhiều 💯.",
    "Tết đến chúc em mỗi ngày đi học đều thật hào hứng 🎒 và đầy động lực 🌟.",
    "Chúc em nghe lời ba mẹ ❤️, kính trọng thầy cô 👩‍🏫 và sống thật tử tế 💎.",
    "Năm mới mong em dám thử điều mới 💡, dám phát biểu ý kiến của mình 🎯.",
    "Chúc em năm nay cao thêm vài centimet 📏 và lớn thêm thật nhiều suy nghĩ tích cực 🌱.",
    "Tết này mong em chơi vui nhưng vẫn nhớ học nhé 😄📚.",
    "Năm mới chúc em ngày càng tự tin 😎, năng động hơn ⚡ và tỏa sáng theo cách riêng ✨.",
    "Chúc em mỗi ngày đều có điều thú vị để khám phá 🔍 và thêm kiến thức mới 📖.",
    "Năm mới mong em luôn giữ nụ cười trên môi 😊 và trái tim đầy ước mơ ❤️.",
    "Tết đến chúc em đạt được những mục tiêu nhỏ của mình 🎯 và tự hào về bản thân 💯.",
    "Chúc em luôn kiên trì 💪, không bỏ cuộc trước thử thách 🛡️.",
    "Năm mới chúc em trở thành phiên bản tốt hơn của chính mình ✨ và có một tuổi học trò thật đẹp 🌸."
  ],

  "16_18": [
    "Năm mới chúc bạn học lực thăng hạng, phong độ ổn định, thi cử mượt như lụa 🎓",
    "Tết này lì xì đầy ví, 10 đầy bảng điểm, tương lai đầy cơ hội ✨",
    "Chúc tuổi mới bớt áp lực, thêm bản lĩnh, càng ngày càng trưởng thành 💪",
    "Năm mới thi đâu trúng đó, chọn ngành đúng gu, chọn trường đúng hướng 🎯",
    "Chúc bạn deadline không dí, bài kiểm tra không trượt, tinh thần luôn vững 😎",
    "Tết này ăn ngon ngủ kỹ, học vừa đủ nhưng kết quả vượt mong đợi 😌",
    "Năm mới điểm số tăng đều, chiều cao tăng nhẹ, thu nhập tăng mạnh 💸",
    "Chúc bạn năm nay bớt overthinking, thêm tự tin khi đứng trước mọi cơ hội 🌟",
    "Thi thử như thi thật, thi thật còn tốt hơn thi thử 🏆",
    "Năm mới version nâng cấp: kỷ luật hơn, tập trung hơn, thành công hơn 🚀",
    "Chúc bạn năm nay không còn học tủ, học gì trúng nấy 📚",
    "Tết này tiền vào ổn định, kiến thức vào đầu liên tục 💰",
    "Năm mới nói được làm được, đặt mục tiêu là đạt mục tiêu 💯",
    "Chúc tuổi mới rực rỡ, sống hết mình nhưng vẫn đúng đường 🛣️",
    "Năm nay thi cử nhẹ nhàng, kết quả vang dội 🎉",
    "Chúc bạn trưởng thành thêm một chút, chín chắn thêm một chút, thành công thêm rất nhiều 😉",
    "Tết này cười nhiều hơn lo, hành động nhiều hơn nghĩ 🤝",
    "Năm mới không ngại thử thách, không sợ thay đổi, chỉ sợ không dám thử 🔥",
    "Chúc bạn mỗi ngày đều tiến bộ 1%, cuối năm hơn hẳn phiên bản cũ 📈",
    "Năm mới tự tin tỏa sáng, đi đến đâu cũng để lại ấn tượng tốt ✨"
  ],

  "18_22": [
    "Năm mới chúc em tuổi mới thật rực rỡ ✨, học hành thuận lợi 📚, thi cử suôn sẻ 📝 và đủ bản lĩnh theo đuổi ước mơ của mình 🚀.",
    "Tết đến chúc em nhận nhiều cơ hội mới 🎯, gặp môi trường tốt 🤝 và trưởng thành hơn mỗi ngày 🌱.",
    "Chúc em luôn giữ được nhiệt huyết tuổi trẻ 🔥, vượt qua áp lực bài vở 💪 và tự tin bước ra khỏi vùng an toàn 🌍.",
    "Năm mới mong em sức khỏe dồi dào 💖, tinh thần tích cực 😊 và mỗi khó khăn đều trở thành bài học quý giá 📖.",
    "Chúc em đạt được mục tiêu đã đặt ra 🎯, từ điểm số cao 📊 đến kỹ năng vững vàng 🧠.",
    "Tết này chúc em học hiệu quả 📚, làm việc năng suất 💼 và vẫn tận hưởng trọn vẹn thanh xuân 🌸.",
    "Năm mới mong em dám nghĩ lớn 💡, dám hành động ⚡ và không ngại thử sức với điều mới mẻ 🌟.",
    "Chúc em ngày càng tự tin hơn 😎, giao tiếp tốt hơn 🎤 và tạo được dấu ấn riêng của mình ✍️.",
    "Năm mới chúc em mỗi ngày đều có động lực cố gắng 🚀 và tự hào về chính mình 💯.",
    "Tết đến mong em một năm nhiều trải nghiệm mới 🌍, nhiều kỷ niệm đẹp 📸 và thật nhiều niềm vui 😄.",
    "Chúc em thi đâu thắng đó 🏆, phỏng vấn đâu đậu đó 🎓 và cơ hội luôn mở rộng phía trước 🚪.",
    "Năm mới chúc em quản lý thời gian tốt hơn ⏰, tập trung hơn 🎧 và hiệu quả hơn mỗi ngày 📈.",
    "Chúc em luôn giữ được sự kiên trì 💪, bình tĩnh trước thử thách 🧩 và mạnh mẽ trước áp lực 🛡️.",
    "Tết này mong em tiền vào ổn định 💰, kinh nghiệm tăng đều 📚 và mối quan hệ ngày càng rộng 🌐.",
    "Năm mới chúc em nói được làm được ✔️, đặt mục tiêu là theo tới cùng 🎯.",
    "Chúc em mỗi ngày thức dậy đều đầy năng lượng ☀️ và sẵn sàng chinh phục thử thách mới 🚀.",
    "Năm mới mong em bớt lo lắng 😌, thêm hành động thực tế 🤝 và gặt hái nhiều kết quả tốt 🎉.",
    "Chúc em luôn biết yêu thương gia đình ❤️, trân trọng bạn bè 🤗 và chăm sóc tốt cho bản thân 🌷.",
    "Tết đến chúc em học hỏi không ngừng 📖, phát triển bản thân mỗi ngày 🌱 và tiến xa hơn trong tương lai 🛣️.",
    "Năm mới chúc em trở thành phiên bản tốt hơn của chính mình ✨, tự tin tỏa sáng 🌟 và sống thật chất lượng 💎."
  ],

  "22_30": [
    "Năm mới chúc bạn tuổi mới sự nghiệp thăng tiến 🚀, thu nhập tăng đều 💰 và mỗi quyết định đều đúng hướng 🎯.",
    "Tết đến chúc bạn công việc thuận lợi 💼, dự án suôn sẻ 📊 và gặp được nhiều cơ hội tốt trong năm mới 🌟.",
    "Chúc bạn luôn giữ được nhiệt huyết 🔥, bản lĩnh vững vàng 💪 và tự tin trước mọi thử thách 🛡️.",
    "Năm mới mong bạn sức khỏe dồi dào 💖, tinh thần ổn định 🧘 và cân bằng tốt giữa công việc và cuộc sống ⚖️.",
    "Chúc bạn mục tiêu đặt ra đều đạt được ✔️, kế hoạch triển khai đều thành công 📈.",
    "Tết này mong bạn tiền vào đều đặn 💵, đầu tư sinh lời 📊 và tài chính ngày càng vững chắc 🏦.",
    "Năm mới chúc bạn networking mở rộng 🤝, gặp được mentor tốt 🎓 và cộng sự chất lượng 🌐.",
    "Chúc bạn mỗi ngày đi làm đều có động lực ☀️ và cảm thấy công việc mình đang làm thật sự ý nghĩa ✨.",
    "Năm mới mong bạn bớt áp lực 😌, thêm hiệu quả ⏱️ và làm việc thông minh hơn 💡.",
    "Chúc bạn luôn giữ được sự chuyên nghiệp 👔, uy tín trong lời nói 🗣️ và chắc chắn trong hành động 🎯.",
    "Tết đến chúc bạn gia đình ấm êm 🏡, bạn bè bền lâu 🤗 và các mối quan hệ ngày càng tốt đẹp ❤️.",
    "Năm mới mong bạn dám bứt phá 🚀, dám thay đổi 🔄 và không ngại nâng cấp bản thân 📚.",
    "Chúc bạn mỗi năm trôi qua đều trưởng thành hơn 🌱 và tự hào hơn về hành trình của mình 🛣️.",
    "Tết này mong bạn làm ít hơn nhưng hiệu quả hơn 📊, kiếm tiền thông minh hơn 💼 và nghỉ ngơi đủ hơn 🌴.",
    "Năm mới chúc bạn tư duy sắc bén 🧠, quyết định chính xác 🎯 và hành động dứt khoát ⚡.",
    "Chúc bạn mọi kế hoạch ấp ủ đều có cơ hội thực hiện 📝 và mang lại kết quả xứng đáng 🏆.",
    "Năm mới mong bạn luôn tự tin 😎, giữ vững giá trị của mình 💎 và không so sánh với ai khác.",
    "Tết đến chúc bạn bước đi vững vàng 👣, sự nghiệp ổn định 📈 và tương lai ngày càng rộng mở 🌅.",
    "Chúc bạn mỗi ngày đều học thêm điều mới 📖, nâng cấp kỹ năng 🔧 và tiến gần hơn tới mục tiêu dài hạn 🎯.",
    "Năm mới chúc bạn trở thành phiên bản thành công hơn của chính mình ✨, sống chất lượng 💎 và hạnh phúc bền lâu 😊."
  ],

  "30_40": [
    "Năm mới chúc bạn tuổi 30–40 sự nghiệp vững vàng 📈, tài chính ổn định 💰 và mỗi bước đi đều chắc chắn 🎯.",
    "Tết đến chúc bạn công việc thuận lợi 💼, dự án thành công 🏆 và vị thế ngày càng nâng cao 🌟.",
    "Chúc bạn luôn giữ được sức khỏe tốt 💖, tinh thần bình an 🧘 và năng lượng tích cực mỗi ngày ☀️.",
    "Năm mới mong bạn cân bằng trọn vẹn giữa công việc và gia đình ⚖️, vừa thành công ngoài xã hội vừa ấm êm trong nhà 🏡.",
    "Chúc bạn mục tiêu đặt ra đều hoàn thành ✔️, kế hoạch triển khai đều suôn sẻ 📊.",
    "Tết này mong bạn tài chính ngày càng vững chắc 🏦, đầu tư hiệu quả 📈 và an tâm cho tương lai 🌅.",
    "Năm mới chúc bạn gặp được cộng sự tốt 🤝, đối tác uy tín 🤗 và mở rộng nhiều cơ hội mới 🌐.",
    "Chúc bạn bản lĩnh hơn 💪, quyết đoán hơn ⚡ và luôn tự tin với những lựa chọn của mình 😎.",
    "Năm mới mong bạn làm việc hiệu quả hơn ⏱️, lãnh đạo vững vàng hơn 👔 và truyền cảm hứng cho người khác 🔥.",
    "Tết đến chúc bạn gia đình hạnh phúc ❤️, con cái ngoan ngoãn 👶 và mái ấm luôn đầy tiếng cười 😄.",
    "Chúc bạn mỗi năm trôi qua đều đạt thêm một cột mốc mới 🎯 và tự hào về hành trình mình đã đi 🛣️.",
    "Năm mới mong bạn bớt áp lực 😌, thêm thảnh thơi 🌿 và dành thời gian nhiều hơn cho bản thân 🏖️.",
    "Chúc bạn giữ vững uy tín trong công việc 👔, chữ tín trong lời nói 🗣️ và sự chính trực trong hành động 💎.",
    "Tết này mong bạn tiền vào đều đặn 💵, tài sản gia tăng 📊 và nền tảng ngày càng bền vững 🏗️.",
    "Năm mới chúc bạn luôn học hỏi không ngừng 📚, nâng cao tư duy 🧠 và phát triển dài hạn 🚀.",
    "Chúc bạn bước đi vững vàng 👣, đối diện thử thách bình tĩnh 🛡️ và giải quyết vấn đề khéo léo 🧩.",
    "Năm mới mong bạn sức khỏe là ưu tiên hàng đầu 💪, tinh thần lạc quan 😊 và cuộc sống hài hòa 🌈.",
    "Tết đến chúc bạn giữ được đam mê ban đầu 🔥 và không ngừng nâng cấp bản thân ✨.",
    "Chúc bạn mỗi ngày đều làm việc với sự tự tin 😎, sống với sự biết ơn 🙏 và yêu thương nhiều hơn ❤️.",
    "Năm mới chúc bạn trở thành phiên bản thành công, chín chắn và hạnh phúc hơn của chính mình 💎✨."
  ],

  "40_plus": [
    "Năm mới chúc bạn tuổi 40+ luôn mạnh khỏe 💪, tinh thần an yên 🧘 và cuộc sống ngày càng viên mãn 🌸.",
    "Tết đến chúc bạn sự nghiệp ổn định 📈, tài chính vững vàng 💰 và gia đình luôn ấm êm 🏡.",
    "Chúc bạn mỗi ngày đều tràn đầy năng lượng ☀️, làm việc hiệu quả 💼 và nghỉ ngơi đủ đầy 🌿.",
    "Năm mới mong bạn gặt hái thêm nhiều thành tựu 🏆 và tự hào về chặng đường mình đã đi 🛣️.",
    "Chúc bạn sức khỏe là ưu tiên hàng đầu ❤️, ăn ngon ngủ kỹ 😴 và tinh thần luôn tích cực 😊.",
    "Tết này mong bạn tiền vào đều đặn 💵, đầu tư sinh lời 📊 và nền tảng tài chính ngày càng bền vững 🏦.",
    "Năm mới chúc bạn gia đình hạnh phúc ❤️, con cháu ngoan ngoãn 👨‍👩‍👧‍👦 và mái ấm luôn đầy tiếng cười 😄.",
    "Chúc bạn luôn giữ được sự điềm tĩnh 🛡️, bản lĩnh 💪 và sáng suốt trong mọi quyết định 🎯.",
    "Năm mới mong bạn có thêm nhiều thời gian cho bản thân 🌴, cho sở thích riêng 🎨 và những chuyến đi ý nghĩa ✈️.",
    "Chúc bạn mỗi năm trôi qua đều thêm giá trị 💎, thêm kinh nghiệm 🧠 và thêm sự thảnh thơi 🌿.",
    "Tết đến chúc bạn các mối quan hệ ngày càng bền chặt 🤝 và gặp nhiều người tốt trên hành trình phía trước 🌟.",
    "Năm mới mong bạn cân bằng trọn vẹn giữa công việc và cuộc sống ⚖️, giữa trách nhiệm và niềm vui 😊.",
    "Chúc bạn luôn giữ chữ tín 👔, sự chính trực 💎 và uy tín trong công việc lẫn cuộc sống.",
    "Tết này mong bạn bình an trong tâm trí 🕊️, vững vàng trong hành động ⚡ và hạnh phúc trong từng khoảnh khắc ✨.",
    "Năm mới chúc bạn tiếp tục truyền cảm hứng 🔥 cho thế hệ sau và lan tỏa những giá trị tốt đẹp 🌱.",
    "Chúc bạn mỗi ngày đều có điều để biết ơn 🙏, có người để yêu thương ❤️ và có mục tiêu để hướng tới 🎯.",
    "Năm mới mong bạn luôn tự tin 😎, tự hào về chính mình 💯 và không ngừng hoàn thiện bản thân 📚.",
    "Tết đến chúc bạn một năm an khang 🌼, thịnh vượng 💰 và nhiều niềm vui bất ngờ 🎉.",
    "Chúc bạn bước đi vững vàng 👣, tâm thế nhẹ nhàng 🌿 và cuộc sống ngày càng trọn vẹn 🌅.",
    "Năm mới chúc bạn trở thành phiên bản bình an, hạnh phúc và thành công hơn của chính mình ✨."
  ],
};

/**
 * Phân loại tuổi vào nhóm để lấy lời chúc phù hợp.
 * @param age Tuổi (năm), có thể null/undefined nếu không chọn.
 * @returns Mã nhóm tuổi; dùng DEFAULT_AGE_GROUP khi không có tuổi hoặc tuổi không hợp lệ.
 */
export function getAgeGroup(age: number | null | undefined): AgeGroup {
  if (age == null || age < 0) return DEFAULT_AGE_GROUP;
  if (age <= 6) return "0_6";
  if (age <= 12) return "6_12";
  if (age <= 16) return "12_16";
  if (age <= 18) return "16_18";
  if (age <= 22) return "18_22";
  if (age <= 30) return "22_30";
  if (age <= 40) return "30_40";
  return "40_plus";
}