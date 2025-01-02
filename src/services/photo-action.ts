'use server'

export interface Photos {
  artcNextSeq: number;
  artcPrevSeq: number;
  artcSeq: number;
  artcSubTitle: string;
  artcTitle: string;
  boardCatSeq: number;
  boardCode: string;
  contentsDate: string;
  delYn: string;
  endDttm: number;
  imgFilePath: string;
  maxArticlePerPage: number;
  regDttm: number;
  regr: string;
  startDttm: number;
  totalPage: number;
  updDttm: number;
  updr: string;
  useYn: string;
  viewCnt: number;
}

export const getPhotos = async (category:number, offset: number, limit: number, query?: string, startDate?: string, endDate?: string) => {
  try {
    const currentPage = Math.floor(offset / limit) + 1;
    if(startDate && endDate){
      const url = `${process.env.SERVER_API_URL}/article/wizphotolist${category}page?itemCount=${limit}&pageNum=${currentPage}&startDate=${startDate}&endDate=${endDate}`
      const response = await fetch(url)
      const result = await response.json()
      return result.data.list as Photos[];
    } else{
    const url = `${process.env.SERVER_API_URL}/article/wizphotolist${category}page?searchWord=${query}&itemCount=${limit}&pageNum=${currentPage}`
    const response = await fetch(url)
    const result = await response.json()
    return result.data.list as Photos[]
    }
  } catch (error: unknown) {
    console.log(error)
    throw new Error(`An error happened: ${error}`)
  }
}

