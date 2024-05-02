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
  // heading1: {
  //   fontSize: 32,
  //   backgroundColor: '#000000',
  //   color: '#FFFFFF',
  // },
  paragraph:{
    fontSize:28,
    color:"white",
    fontWeight:"600"
  },

  list_item:{
    fontSize:20,
    color:"white",
    fontWeight:"600"
  }

})

const Bookmark = () => {

  const { user } = useGlobalContext();


  const ref = useRef(null)
  const [isSubmitting, setSubmitting] = useState(false);
  const [isLoading, setLoading] = useState(true)

  const [text, setText] = useState(null)

  const genAI = new GoogleGenerativeAI(API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

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

  if(isLoading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <ScrollView className="px-4 my-6">
          <Text className="text-2xl text-white font-psemibold">Loading...</Text>
          <Loader isLoading={isLoading}/>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Bookmark</Text>

        {/* <View className="flex justify-center items-center px-4"> */}
          <Text className="text-xl text-white font-psemibold mt-7" ref={ref}>
          <Markdown style={styles}>
          {text}
          </Markdown>
            

          </Text>

          <CustomButton
            title={"Create AI Generated Dental Plan from your Dental History"}
            handlePress={handleSubmit}
            containerStyles="mt-7 p-5 w-full"
            textStyles={""}
            isLoading={isSubmitting}
          />
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Bookmark;
