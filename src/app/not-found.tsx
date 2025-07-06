const NotFound = () => {
  return (
    <div className="mt-16 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-foreground text-6xl font-bold">404</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            페이지를 찾을 수 없습니다
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
