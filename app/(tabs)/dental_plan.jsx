import { ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { API_KEY } from "@env"
import { useRef, useState, useEffect } from "react";
import { getAiGeneratedPlan, getCustomDentalPlan, updateAiGeneratedPlan } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { CustomButton, Loader } from "../../components";
import Markdown from "react-native-markdown-display";

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 28,
    color: "white",
    fontWeight: "600"
  },
  list_item: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
  }
})

const dental_plan = () => {
  const { user } = useGlobalContext();

  const ref = useRef(null)
  const [isSubmitting, setSubmitting] = useState(false);
  const [isLoading, setLoading] = useState(true)
  const [text, setText] = useState(null)

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const scrollViewRef = useRef(null);

  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = (event) => {
    const scrollHeight = event.nativeEvent.contentSize.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const contentHeight = scrollHeight - event.nativeEvent.layoutMeasurement.height;

    if (scrollOffset >= contentHeight - 5) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  };

  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  const handleScrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleScrollToggle = () => {
    if (isAtBottom) {
      handleScrollToTop();
    } else {
      handleScrollToBottom();
    }
  };

  useEffect(() => {
    async function run() {
      const plan = await getCustomDentalPlan(user.$id);

      const {
        age,
        existingConditions,
        recentProcedures,
        hygieneFrequency,
        toothbrush,
        toothpaste,
        dietaryHabits,
        dentalAppliances_allergies,
        creator_dental
      } = plan
    }

    run();
  }, []); // Empty dependency array ensures it runs only once

  useEffect(() => {
    getAiGeneratedPlan(user).then(res => {
      setText(res.ai_generated_plan == "" ? null : res.ai_generated_plan)
      setLoading(false)
    })
  }, [user])

  const handleSubmit = async () => {
    setSubmitting(true)
    const plan = await getCustomDentalPlan(user.$id);

    const {
      age,
      existingConditions,
      recentProcedures,
      hygieneFrequency,
      toothbrush,
      toothpaste,
      dietaryHabits,
      dentalAppliances_allergies,
      creator_dental
    } = plan

    console.log(plan)

    const prompt = `Using the following information, creating a custom dental plan: \n age: ${age}, \n Do you have any existing dental conditions or concerns?: ${existingConditions} \n
    Did you have any recent dental procedures or discomfort?: ${recentProcedures} \n
    How often do you brush, floss, and use mouthwash?: ${hygieneFrequency} \n
    What type of toothbrush do you use?: ${toothbrush} \n
    What type of toothpaste do you use?: ${toothpaste} \n
    What dietary habits or health concerning conditions/habits do you have? (ex: sugary, acidic foods, smoking): ${dietaryHabits} \n
    What dental appliances or allergies do you have?: ${dentalAppliances_allergies}
    `

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);

    setText(text)
    setSubmitting(false)

    await updateAiGeneratedPlan(user, text)
  }

  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <ScrollView className="px-4 my-6">
          <Text className="text-2xl text-white font-psemibold">Loading...</Text>
          <Loader isLoading={isLoading} />
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView
          className="px-4 my-6"
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Text className="text-2xl text-white font-psemibold underline">Custom Dental Plan</Text>

          <View style={{ flex: 1 }}>
            <ScrollView>
              <Markdown style={styles}>
                {text}
              </Markdown>
            </ScrollView>
          </View>

          <CustomButton
            title={"Create AI Generated Dental Plan from your Dental History"}
            handlePress={handleSubmit}
            containerStyles="mt-7 p-5 w-full"
            textStyles={""}
            isLoading={isSubmitting}
          />
        </ScrollView>
        {text && (
          <CustomButton
            title={isAtBottom ? "Scroll to Top" : "Scroll to Bottom"}
            containerStyles="mt-7 p-5 w-2/3 mx-auto px-auto"
            textStyles={""}
            handlePress={handleScrollToggle}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default dental_plan;