import { View, Text, Image } from "react-native";
import Ratings from "@/utils/ratings";

export default function ReviewCourseCard({ item }: { item: ReviewType }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <Image
        style={{ width: 50, height: 50, borderRadius: 100 }}
        source={{
          uri:
            item.user?.avatar?.url ||
            "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png",
        }}
      />
      <View style={{ marginHorizontal: 8, flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "space-around" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <View>
                <Text style={{ fontSize: 18, fontFamily: "Raleway_700Bold" }}>
                  {item.user.name}
                </Text>
              </View>
              <View>
                <Ratings rating={item.rating} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    paddingVertical: 5,
                    paddingHorizontal: 3,
                  }}
                >
                  {item.comment}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
