/**
 * Lời chúc theo nhóm tuổi:
 * - all: dùng cho mọi lứa tuổi hoặc khi không có tuổi
 * - child: 0–12 (nhi đồng)
 * - teen: 13–17 (thiếu niên)
 * - adult: 18–40 (thanh niên, trung niên trẻ)
 * - elder: 41+ (trung niên, cao tuổi)
 */
export const wishesByAge: Record<string, string[]> = {
  all: [
    "Chúc mừng năm mới! Vạn sự như ý, an khang thịnh vượng!",
    "Năm mới phát tài phát lộc, sức khỏe dồi dào!",
    "Cung chúc tân xuân! Phúc – Lộc – Thọ!",
    "Chúc năm mới hạnh phúc, vạn sự cát tường!",
    "An khang thịnh vượng, tấn tài tấn lộc!",
    "Năm mới bình an, thuận lợi đôi đường!",
    "Chúc sức khỏe dồi dào, tài lộc đầy nhà!",
    "Tân niên vạn phúc, gia đình hạnh phúc!",
    "Chúc xuân sang an lành, phú quý vinh hoa!",
    "Năm mới muôn điều tốt đẹp, phúc lộc an khang!",
    "Chúc tân niên thịnh vượng, mọi sự hanh thông!",
    "Chúc năm mới tràn đầy niềm vui và may mắn!",
    "Xuân sang phú quý, năm mới an lành!",
    "Chúc gặp ai cũng vui, làm gì cũng suôn!",
    "Chúc Tết này bình an vô sự, năm tới phát tài phát lộc!",
  ],

  child: [
    "Chúc em năm mới ngoan ngoãn, học giỏi, được nhiều lì xì!",
    "Năm mới chúc em hay ăn chóng lớn, luôn vui vẻ!",
    "Chúc em Tết vui vẻ, chơi game giỏi, thi đâu đỗ đấy!",
    "Năm mới em được nhiều quà, nhiều bánh kẹo, nhiều lì xì!",
    "Chúc em luôn khỏe mạnh, cười tươi như hoa!",
    "Năm mới ba mẹ khen, ông bà thương, bạn bè quý!",
    "Chúc em năm nay điểm 10 đầy sổ, không bị mắng!",
    "Năm mới chúc em ngủ sớm dậy sớm, không bị nhắc!",
    "Chúc em được đi chơi nhiều, ăn nhiều, vui nhiều!",
    "Năm mới em cao thêm, khỏe thêm, xinh thêm!",
  ],

  teen: [
    "Năm mới xem phim Tết không spoiler, chơi game không lag!",
    "Chúc năm nay thi đâu đỗ đấy, không phải học thêm!",
    "Năm mới crush nhắn tin trước, hẹn hò không bị ghost!",
    "Chúc lì xì đầy túi, ví không bao giờ rỗng!",
    "Năm mới ba mẹ không so con nhà người ta!",
    "Chúc học tài thi phận, điểm cao không cần học khuya!",
    "Năm mới bạn bè rủ đi chơi suốt, không ai hỏi bài!",
    "Chúc năm nay được mua đồ mới, điện thoại không lag!",
    "Năm mới ngủ đủ giấc, dậy vẫn kịp đi học!",
    "Chúc Tết này vui hết mình, năm tới thi đỗ đại học!",
  ],

  adult: [
    "Chúc năm nay bug tự biến mất, deploy một phát là xong!",
    "Chúc code chạy lần đầu là pass, không cần debug!",
    "Tiền về như lũ, sếp tăng lương không cần xin!",
    "Chúc WiFi không bao giờ lag, pin không bao giờ hết!",
    "Năm mới không OT, không fix bug ngày Tết!",
    "Chúc production không bao giờ sập, on-call không bao giờ kêu!",
    "Chúc inbox luôn trống, deadline luôn xa!",
    "Năm mới tiền nhiều hơn bug, yêu đời hơn yêu code!",
    "Chúc lương tháng 13… 14… 15 luôn cho nóng!",
    "Chúc git merge không bao giờ conflict!",
    "Năm mới review code không ai reject!",
    "Chúc gặp sếp toàn tin vui, họp toàn tin vắn!",
    "Chúc bán bánh chưng không dính lá, gói nem không bể!",
    "Chúc đi đâu cũng gặp đèn xanh, đỗ xe không bị phạt!",
    "Chúc sáng dậy bình tĩnh, tối ngủ không nghĩ đến việc!",
    "Năm mới mèo không cào ghế, chó không cắn dép!",
    "Chúc gửi nhầm tin đúng người, chuyển nhầm tiền đúng số!",
    "Chúc đi chợ Tết không bị chặt chém, mua gì cũng hời!",
    "Năm mới thắng lớn mỗi lần đá phạt, mỗi ván bài đều ù!",
    "Chúc karaoke hát đúng tone, nhậu không say về vẫn nhớ đường!",
    "Chúc họ hàng hỏi gì trả lời được hết, không ai hỏi lương!",
    "Năm mới mở tủ lạnh toàn đồ ăn, mở ví toàn tiền!",
    "Chúc làm gì cũng có người khen, sai đâu sửa đó không ai chê!",
    "Chúc năm mới đủ tiền mua quà, đủ sức đi chúc Tết hết nhà!",
    "Năm mới một bước lên mây, hai bước về nhà không mệt!",
  ],

  elder: [
    "Chúc năm mới sức khỏe dồi dào, con cháu sum vầy!",
    "Năm mới an khang thịnh vượng, phúc lộc trường thọ!",
    "Chúc ông bà luôn vui khỏe, con cháu hiếu thảo!",
    "Năm mới ăn ngon ngủ tốt, không đau không ốm!",
    "Chúc gia đình đoàn viên, trên thuận dưới hòa!",
    "Năm mới phúc như Đông Hải, thọ tỷ Nam Sơn!",
    "Chúc sáng dậy khỏe re, tối về ngủ ngon!",
    "Năm mới cháu ngoan cháu giỏi, con cái thuận hòa!",
    "Chúc Tết ấm no, bình an vô sự!",
    "Năm mới vạn sự như ý, sống lâu trăm tuổi!",
  ],
};

export type AgeGroup = "all" | "child" | "teen" | "adult" | "elder";

/** 0–12: child, 13–17: teen, 18–40: adult, 41+: elder, null/undefined: all */
export function getAgeGroup(age: number | null | undefined): AgeGroup {
  if (age == null || age < 0) return "all";
  if (age <= 12) return "child";
  if (age <= 17) return "teen";
  if (age <= 40) return "adult";
  return "elder";
}
