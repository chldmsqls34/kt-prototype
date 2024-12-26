'use server'

export interface Photos {
  artcContents: string;
  artcNextSeq: number;
  artcPrevSeq: number;
  artcSeq: number;
  artcSubTitle: string;
  artcTitle: string;
  boardCatSeq: number;
  boardCode: string;
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

export const getPhotos = async (offset: number, limit: number) => {
  try {
    const url = `${process.env.PHOTO_API_URL}/v2/article/listByCategory?article.boardCode=006&search.pos=${offset}&search.max=${limit}`
    const response = await fetch(url)
    const result = await response.json()
    return result.data.list as Photos[]
  } catch (error: unknown) {
    console.log(error)
    throw new Error(`An error happened: ${error}`)
  }
}