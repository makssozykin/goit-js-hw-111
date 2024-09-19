import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38944532-b9bc2caa643ed39ffb47780c7';

export class searchApi {
  constructor() {
    this.query = '';
    this.page = 1;
    this.per_page = 40;
  }

  async onSearchPhoto() {
    const params = new URLSearchParams({
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.per_page,
      query: this.query,
    });

    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&${params}`);
    return response.data;
  }
  increasePage() {
    this.page += 1;
  }
  decreasePage() {
    this.page -= 1;
  }
  resetPage() {
    this.page = 1; // Reset page number to 1 when user resets the search query
  }
}
