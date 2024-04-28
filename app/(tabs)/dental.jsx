import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity, Text, ScrollView } from "react-native";

import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { CustomButton, EmptyState, FormField, InfoBox, VideoCard } from "../../components";
import { DentalHistoryFormField } from "../../components";
import { useState } from "react";


const DentalHistory = () => {

    const { setUser, setIsLogged, setNewUser, newUser } = useGlobalContext();


    const [form, setForm] = useState({
        title: "",
        age: null,
        gender: null,
        existingConditions: "",
        recentProcedures: "",
        hygieneFrequency: "",
        toothbrush: "",
        toothpaste: "",
        dietaryHabits:"",
        dentalAppliances_allergies: "",

    })

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView className="px-4 my-6">
                <Text className="text-2xl text-white font-psemibold">Dental History</Text>
                {/* 
                title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10" */}

                <DentalHistoryFormField
                    title="Age"
                    value={form.age}
                    placeholder={"How old are you?"}
                    handleChangeText={(e) => setForm({ ...form, age: e })}
                    otherStyles={"mt-10"}
                />

                <V


            </ScrollView>



        </SafeAreaView>
    )

}

export default DentalHistory;