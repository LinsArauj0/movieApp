import { View, Text, TextInput, FlatList, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { MagnifyingGlass } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { CardMovies } from "../../components/CardMovies";
import { api } from "../../services/api";

interface Moive {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
}

export function Home() {
    const [discoveryMovies, setDiscoveyMovies] = useState<Moive[]>([]);
    const [searchResultMovies, setSearchResultMovies] = useState<Moive[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [noResult, setNoResult] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadMoreData();
    }, []);
    

    const loadMoreData = async () => {
      setLoading(true);
        const response = await api.get("/movie/popular", {
          params: { 
            page, },
        });
        setDiscoveyMovies([...discoveryMovies, ...response.data.results]);
        setPage(page + 1);
        setLoading(false);
        //console.log(JSON.stringify(response.data, null, 2));
    };

    const searchMovie = async (query: string) => {
      setLoading(true);
      const response = await api.get("/search/movie", {
        params: {
          query,
        },
      });
      if (response.data.results.length === 0) {
        setNoResult(true);
      } else {
        setSearchResultMovies(response.data.results);
      }
      setLoading(true);
    };
    
    const hendleSearch = (text: string) => {
      setSearch(text);
      if(text.length > 2) {
        searchMovie(text);
      }else{
        setSearchResultMovies([]);
      }
    }
   /* const loadMoreData = async () => {
      try {
          const response = await api.get("/movie/popular");
          if (response.status === 200) {
              setDiscoveyMovies(response.data.results);
              console.log(JSON.stringify(response.data, null, 2));
          } else {
              console.error("Erro ao carregar dados da API:", response.statusText);
          }
      } catch (error) {
          console.error("Erro ao carregar dados da API:", error);
      }
  };*/
    const movieData = search.length > 2 ? searchResultMovies : discoveryMovies;
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Oque você quer assistir hoje?</Text>
          <View style={styles.containerInput}>
            <TextInput
              placeholderTextColor="#ccc"
              placeholder="Buscar"
              style={styles.input}
              value={search}
              onChangeText={hendleSearch}
            />
            <MagnifyingGlass color="#fff" size={25} weight="light" />
          </View>
        </View>
        <View>
          <FlatList
            data={movieData}
            numColumns={3}
            renderItem={(item) => <CardMovies data={item.item} />}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              padding: 35,
              paddingBottom: 100, }}
              onEndReached={() => {loadMoreData()}}
              onEndReachedThreshold={0.5}
          />
          {loading && <ActivityIndicator size={50} color="#0296e5" />}
        </View>
      </View>
    );
};