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
    "Chúc bé năm mới ăn ngoan, ngủ kỹ, lớn nhanh như thổi và lúc nào cũng cười tít mắt đáng yêu nhất nhà!",
    "Năm mới chúc con khỏe mạnh, vui vẻ, được nhiều quà và ôm lì xì mà không chịu buông!",
    "Chúc bé cả năm không ốm đau, chơi thật vui và được ba mẹ chiều hết nấc!",
    "Năm mới chúc con mỗi ngày đều khám phá được điều mới lạ và luôn cười giòn tan!",
    "Chúc bé năm nay cao thêm một khúc, thông minh thêm vài phần và đáng yêu gấp mười lần!",
    "Năm mới chúc con ăn gì cũng ngon, chơi gì cũng vui và không bao giờ bị la!",
    "Chúc bé lúc nào cũng mạnh khỏe, ngủ ngon và mơ toàn những giấc mơ đẹp như cổ tích!",
    "Năm mới chúc con luôn vui vẻ, chạy nhảy thật nhanh và cười thật tươi!",
    "Chúc bé năm nay nói sõi hơn, hát hay hơn và làm cả nhà cười nhiều hơn!",
    "Năm mới chúc con có thật nhiều bạn mới và chơi đâu cũng vui!",
    "Chúc bé luôn được yêu thương, được ôm nhiều và được lì xì nhiều gấp đôi năm trước!",
    "Năm mới chúc con khỏe mạnh như siêu nhân và đáng yêu như thiên thần!",
    "Chúc bé ăn ngoan để chóng lớn và nhận thêm thật nhiều lì xì!",
    "Năm mới chúc con không khóc nhè, không nhõng nhẽo mà lúc nào cũng cười tươi!",
    "Chúc bé năm nay học nói nhanh hơn, chạy nhanh hơn và vui nhiều hơn!",
    "Năm mới chúc con luôn vui vẻ, ba mẹ tự hào và ông bà thương yêu hết mực!",
    "Chúc bé luôn hồn nhiên, vui vẻ và mang tiếng cười đến cho cả nhà!",
    "Năm mới chúc con khỏe như voi con, nhanh như thỏ nhỏ và cười như nắng!",
    "Chúc bé mỗi ngày đều là một ngày vui và mỗi lần mở lì xì đều thấy thích thú!",
    "Năm mới chúc con lớn lên thật hạnh phúc và luôn được bao bọc trong yêu thương!"
  ],

  "6_12": [
    "Chúc con năm mới học giỏi hơn năm cũ, làm bài không cần nhắc mà điểm vẫn cao ngất ngưởng!",
    "Năm mới chúc con cao thêm vài phân, giỏi thêm vài phần và tiền lì xì phải nhét đầy cả heo đất!",
    "Chúc con đi học luôn được cô khen, về nhà được ba mẹ thưởng và Tết này mở lì xì mỏi tay!",
    "Năm mới chúc con thi đâu trúng đó, kiểm tra toàn điểm cao mà không cần học khuya!",
    "Chúc con năm nay đọc sách nhiều hơn, chơi game ít hơn và vẫn vui hết mình!",
    "Năm mới chúc con luôn tự tin, mạnh dạn và không sợ phát biểu trước lớp!",
    "Chúc con mỗi ngày đến trường là một ngày vui, về nhà là một ngày cười!",
    "Năm mới chúc con học đâu hiểu đó, làm đâu đúng đó và không bị mắng!",
    "Chúc con năm nay đạt thật nhiều thành tích để cả nhà tự hào!",
    "Năm mới chúc con luôn khỏe mạnh, nhanh nhẹn và vui vẻ!",
    "Chúc con năm nay kết thêm nhiều bạn tốt và có thật nhiều kỷ niệm đẹp!",
    "Năm mới chúc con ăn khỏe, ngủ ngon và cao lớn vượt bậc!",
    "Chúc con năm nay đạt điểm 10 nhiều hơn số lần bị nhắc nhở!",
    "Năm mới chúc con luôn tự tin và dám thử những điều mới!",
    "Chúc con học giỏi, chơi vui và luôn là niềm tự hào của gia đình!",
    "Năm mới chúc con đạt được những ước mơ nhỏ bé của mình!",
    "Chúc con năm nay tham gia hoạt động gì cũng được khen!",
    "Năm mới chúc con luôn vui tươi như ánh nắng đầu xuân!",
    "Chúc con mỗi ngày đều tiến bộ hơn một chút và hạnh phúc hơn một chút!",
    "Năm mới chúc con thành công trong học tập và nhận được thật nhiều lời khen!"
  ],

  "12_16": [
    "Năm mới chúc bạn học đâu hiểu đó, thi đâu trúng đó và không còn bị hỏi 'sao chưa học bài?'!",
    "Chúc bạn năm nay vừa học giỏi vừa chơi chất, crush nhìn là phải để ý ngay!",
    "Năm mới chúc bạn lớn thêm một tuổi nhưng đừng lớn thêm áp lực, mọi thứ cứ từ từ mà thành công!",
  ],

  "16_18": [
    "Chúc năm nay thi cử suôn sẻ, chọn đúng ngành mình thích và điểm số đẹp như mơ!",
    "Năm mới chúc bạn bước vào tuổi trưởng thành thật tự tin, tự chủ và không còn lo lắng mông lung!",
    "Chúc bạn năm nay đạt được mục tiêu lớn nhất đời học sinh – thi đâu đỗ đó, không phải học lại!",
  ],

  "18_22": [
    "Chúc năm mới đi học đại học không trễ deadline, làm bài nhóm không gặp team 'tàng hình'!",
    "Năm mới chúc bạn thực tập đâu cũng được nhận, CV gửi đâu cũng được gọi phỏng vấn!",
    "Chúc tuổi trẻ của bạn rực rỡ, dám thử, dám sai và dám thành công thật lớn!",
  ],

  "22_30": [
    "Chúc năm nay công việc suôn sẻ, lương tăng đều và cuối tháng tài khoản không bao giờ về 0!",
    "Năm mới chúc bạn sự nghiệp thăng hoa, tình yêu ổn định và sức khỏe luôn full pin!",
    "Chúc năm nay làm ít mà tiền nhiều, deadline xa mà cơ hội gần!",
  ],

  "30_40": [
    "Chúc năm mới sự nghiệp vững vàng, gia đình ấm êm và mọi dự định đều thành hiện thực!",
    "Năm mới chúc bạn cân bằng được công việc và cuộc sống, kiếm tiền giỏi mà vẫn ngủ ngon!",
    "Chúc năm nay đầu tư đâu thắng đó, làm gì cũng có lộc và gia đình luôn tràn đầy tiếng cười!",
  ],

  "40_plus": [
    "Chúc năm mới sức khỏe dồi dào, tinh thần minh mẫn và mỗi ngày đều an nhiên hạnh phúc!",
    "Năm mới kính chúc gia đình sum vầy, con cháu hiếu thảo và mọi việc đều hanh thông!",
    "Chúc một năm bình an, phúc lộc đầy nhà và niềm vui nối tiếp niềm vui!",
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