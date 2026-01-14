import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const App = () => {
    const [myData, setMyData] = useState([]);
    const [searchText, setSearchText] = useState("");

    // store original data safely
    const originalData = useRef([]);

    // fetch data once
    useEffect(() => {
        const url = "https://onlinecardappwebservice-2.onrender.com/allcards";

        fetch(url)
            .then((response) => response.json())
            .then((json) => {
                setMyData(json);
                originalData.current = json;
            })
            .catch((error) => console.error("Fetch error:", error));
    }, []);

    // case-insensitive search
    const FilterData = (text) => {
        setSearchText(text);

        const input = text.toLowerCase();

        if (input !== "") {
            const filteredData = originalData.current.filter((item) =>
                item.card_name.toLowerCase().includes(input)
            );
            setMyData(filteredData);
        } else {
            setMyData(originalData.current);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <View style={styles.textBox}>
                    <Text style={styles.cardName}>{item.card_name}</Text>
                </View>

                <Image
                    source={{ uri: item.card_pic }} // ✅ correct DB field
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />

            <Text style={styles.label}>Search:</Text>
            <TextInput
                style={styles.input}
                placeholder="Search card name..."
                value={searchText}
                onChangeText={FilterData}
                autoCapitalize="none"
            />

            <FlatList
                data={myData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: "#fff",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    textBox: {
        flex: 1,
        paddingRight: 10,
    },
    cardName: {
        fontSize: 16,
        fontWeight: "700",
    },
    image: {
        width: 90,
        height: 120,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#eee",
    },
});
