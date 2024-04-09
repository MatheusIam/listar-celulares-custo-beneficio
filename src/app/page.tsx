import getDataFromAPI from "@/utils/getDataFromAPI";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
const Home = async () => {
  const device = "samsung-galaxy-a14-5g";
  const antutuData = await getDataFromAPI(device);

  if (antutuData) {
    console.log(`Benchmark Antutu para ${device}:`);
    console.log(`  Pontuação: ${antutuData.benchmark}`);
    console.log(`  Versão: ${antutuData.version}`);
  } else {
    console.log("Erro ao carregar dados do Antutu");
  }

  return (
    <Container maxWidth="lg">
      <Typography>Matheus Iam</Typography>
    </Container>
  );
};

export default Home;
